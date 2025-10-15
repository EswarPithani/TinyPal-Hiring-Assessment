import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Animated,
    Easing,
    Dimensions,
    ScrollView,
    RefreshControl,
    Modal,
    TouchableWithoutFeedback
} from 'react-native';
import { globalStyles, colors } from '../styles/global';
import { apiService } from '../services/api';
import Card from '../components/Card';
import TinuBottomSheet from '../components/BottomSheet';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FlashCardScreen = () => {
    const [flashCards, setFlashCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [inputText, setInputText] = useState('');
    const [tinuData, setTinuData] = useState({ cards: [], chips: [] });
    const [showBottomSheet, setShowBottomSheet] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedCard, setSelectedCard] = useState(null);
    const [showCardModal, setShowCardModal] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const flipAnim = useRef(new Animated.Value(0)).current;

    const categories = [
        { id: 'all', label: 'All Cards', icon: '🃏', count: 12 },
        { id: 'behavior', label: 'Behavior', icon: '👶', count: 4 },
        { id: 'development', label: 'Development', icon: '📈', count: 3 },
        { id: 'nutrition', label: 'Nutrition', icon: '🍎', count: 3 },
        { id: 'sleep', label: 'Sleep', icon: '😴', count: 2 },
    ];

    useEffect(() => {
        loadFlashCardData();
        startAnimations();
    }, []);

    const startAnimations = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
                easing: Easing.out(Easing.cubic)
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
                easing: Easing.out(Easing.back(1))
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                tension: 60,
                friction: 7
            })
        ]).start();
    };

    const loadFlashCardData = async () => {
        try {
            setLoading(true);
            const data = await apiService.getPersonalizedAnswers();

            console.log('Transformed data:', data);

            if (data && data.flash_cards) {
                setFlashCards(data.flash_cards);
            } else {
                console.warn('No flash cards in response:', data);
                setFlashCards([]);
            }
        } catch (error) {
            console.error('Error loading Flash Card data:', error);
            setFlashCards([]);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadFlashCardData();
    };

    const handleAskTinu = async () => {
        try {
            const data = await apiService.activateTinu('flash_card');
            setTinuData(data);
            setShowBottomSheet(true);
        } catch (error) {
            console.error('Error activating Tinu:', error);
        }
    };

    const handleChipPress = (chip) => {
        setInputText(chip.label);
    };

    const handleSendMessage = () => {
        console.log('Sending message:', inputText);
        setInputText('');
    };

    const handleCloseBottomSheet = () => {
        setShowBottomSheet(false);
    };

    const handleCardPress = (item) => {
        setSelectedCard(item);
        setShowCardModal(true);
        setIsFlipped(false);
        flipAnim.setValue(0);
    };

    const handleCloseCardModal = () => {
        setShowCardModal(false);
        setSelectedCard(null);
        setIsFlipped(false);
    };

    const handleFlipCard = () => {
        Animated.spring(flipAnim, {
            toValue: isFlipped ? 0 : 1,
            useNativeDriver: true,
            tension: 60,
            friction: 7
        }).start();
        setIsFlipped(!isFlipped);
    };

    const CategoryChip = ({ category, isActive, onPress }) => (
        <TouchableOpacity
            style={[
                styles.categoryChip,
                isActive && styles.categoryChipActive
            ]}
            onPress={onPress}
        >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[
                styles.categoryLabel,
                isActive && styles.categoryLabelActive
            ]}>
                {category.label}
            </Text>
            <View style={[
                styles.categoryCount,
                isActive && styles.categoryCountActive
            ]}>
                <Text style={styles.categoryCountText}>{category.count}</Text>
            </View>
        </TouchableOpacity>
    );

    const ViewModeToggle = () => (
        <View style={styles.viewModeContainer}>
            <TouchableOpacity
                style={[
                    styles.viewModeButton,
                    viewMode === 'grid' && styles.viewModeButtonActive
                ]}
                onPress={() => setViewMode('grid')}
            >
                <Text style={[
                    styles.viewModeIcon,
                    viewMode === 'grid' && styles.viewModeIconActive
                ]}>◼️◼️</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.viewModeButton,
                    viewMode === 'list' && styles.viewModeButtonActive
                ]}
                onPress={() => setViewMode('list')}
            >
                <Text style={[
                    styles.viewModeIcon,
                    viewMode === 'list' && styles.viewModeIconActive
                ]}>📋</Text>
            </TouchableOpacity>
        </View>
    );

    // Flip animation interpolations
    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
    });

    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg']
    });

    const frontAnimatedStyle = {
        transform: [{ rotateY: frontInterpolate }]
    };

    const backAnimatedStyle = {
        transform: [{ rotateY: backInterpolate }]
    };

    const FullScreenCardModal = () => (
        <Modal
            visible={showCardModal}
            transparent
            animationType="fade"
            onRequestClose={handleCloseCardModal}
        >
            <View style={styles.modalContainer}>
                <TouchableWithoutFeedback onPress={handleCloseCardModal}>
                    <View style={styles.modalBackdrop} />
                </TouchableWithoutFeedback>

                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Flash Card</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleCloseCardModal}
                        >
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Flip Card Container */}
                    <TouchableWithoutFeedback onPress={handleFlipCard}>
                        <View style={styles.flipContainer}>
                            {/* Front of Card */}
                            <Animated.View style={[styles.cardFace, styles.cardFront, frontAnimatedStyle]}>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardType}>QUESTION</Text>
                                    <Text style={styles.cardMainText}>
                                        {selectedCard?.question || selectedCard?.heading}
                                    </Text>
                                    <View style={styles.flipHint}>
                                        <Text style={styles.flipHintText}>Tap to see answer</Text>
                                        <Text style={styles.flipHintIcon}>👆</Text>
                                    </View>
                                </View>
                            </Animated.View>

                            {/* Back of Card */}
                            <Animated.View style={[styles.cardFace, styles.cardBack, backAnimatedStyle]}>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardType}>ANSWER</Text>
                                    <Text style={styles.cardMainText}>
                                        {selectedCard?.answer || selectedCard?.content}
                                    </Text>
                                    <View style={styles.flipHint}>
                                        <Text style={styles.flipHintText}>Tap to see question</Text>
                                        <Text style={styles.flipHintIcon}>👆</Text>
                                    </View>
                                </View>
                            </Animated.View>
                        </View>
                    </TouchableWithoutFeedback>

                    {/* Card Actions */}
                    <View style={styles.cardActions}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionIcon}>⭐</Text>
                            <Text style={styles.actionText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionIcon}>🔁</Text>
                            <Text style={styles.actionText}>Flip</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionIcon}>📤</Text>
                            <Text style={styles.actionText}>Share</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Progress */}
                    <View style={styles.progressSection}>
                        <Text style={styles.progressText}>
                            Card {flashCards.findIndex(card => card.id === selectedCard?.id) + 1} of {flashCards.length}
                        </Text>
                        <View style={styles.progressBar}>
                            <View style={[
                                styles.progressFill,
                                {
                                    width: `${((flashCards.findIndex(card => card.id === selectedCard?.id) + 1) / flashCards.length) * 100}%`
                                }
                            ]} />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const EnhancedFlashCard = ({ item, index }) => (
        <Animated.View
            style={[
                styles.flashCardContainer,
                {
                    opacity: fadeAnim,
                    transform: [
                        { translateY: slideAnim },
                        { scale: scaleAnim }
                    ]
                }
            ]}
        >
            <TouchableOpacity
                style={styles.enhancedFlashCard}
                onPress={() => handleCardPress(item)}
                activeOpacity={0.9}
            >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                    <View style={styles.cardNumber}>
                        <Text style={styles.cardNumberText}>#{index + 1}</Text>
                    </View>
                    <View style={styles.cardActionsSmall}>
                        <TouchableOpacity style={styles.actionButtonSmall}>
                            <Text style={styles.actionIcon}>⭐</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Question Preview */}
                <View style={styles.questionSection}>
                    <Text style={styles.questionLabel}>QUESTION</Text>
                    <Text style={styles.questionText} numberOfLines={3}>
                        {item.question || item.heading}
                    </Text>
                </View>

                {/* Answer Preview */}
                <View style={styles.answerSection}>
                    <Text style={styles.answerLabel}>ANSWER</Text>
                    <Text style={styles.answerText} numberOfLines={2}>
                        {item.answer || item.content}
                    </Text>
                </View>

                {/* Card Footer */}
                <View style={styles.cardFooter}>
                    <View style={styles.difficulty}>
                        <View style={styles.difficultyDot} />
                        <Text style={styles.difficultyText}>Beginner</Text>
                    </View>
                    <Text style={styles.cardTime}>Tap to open</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    const renderCard = ({ item, index }) => (
        <EnhancedFlashCard item={item} index={index} />
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Animated.View style={[styles.loadingCard, { opacity: fadeAnim }]}>
                    <Text style={styles.loadingEmoji}>🎴</Text>
                    <Text style={styles.loadingText}>Loading Flash Cards...</Text>
                    <Text style={styles.loadingSubtext}>Preparing your learning journey</Text>
                </Animated.View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <Animated.View
                style={[
                    styles.header,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}
            >
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.title}>Flash Cards</Text>
                        <Text style={styles.subtitle}>Learn parenting tips interactively</Text>
                    </View>
                    <ViewModeToggle />
                </View>

                {/* Categories Scroll */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesScroll}
                    contentContainerStyle={styles.categoriesContainer}
                >
                    {categories.map((category) => (
                        <CategoryChip
                            key={category.id}
                            category={category}
                            isActive={activeCategory === category.id}
                            onPress={() => setActiveCategory(category.id)}
                        />
                    ))}
                </ScrollView>
            </Animated.View>

            {/* Flash Cards List */}
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}
            >
                <FlatList
                    data={flashCards}
                    renderItem={renderCard}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.cardsContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyEmoji}>📚</Text>
                            <Text style={styles.emptyTitle}>No Flash Cards Yet</Text>
                            <Text style={styles.emptyText}>
                                Check back later for new parenting insights and tips!
                            </Text>
                        </View>
                    }
                    ListHeaderComponent={
                        <View style={styles.statsBar}>
                            <Text style={styles.statsText}>
                                {flashCards.length} cards • {Math.floor(Math.random() * 60) + 10} mins total
                            </Text>
                        </View>
                    }
                />
            </Animated.View>

            {/* Enhanced Ask Tinu Button */}
            <Animated.View
                style={[
                    styles.tinuButtonContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                <TouchableOpacity
                    style={styles.enhancedTinuButton}
                    onPress={handleAskTinu}
                    activeOpacity={0.8}
                >
                    <View style={styles.tinuButtonContent}>
                        <View style={styles.tinuAvatar}>
                            <Text style={styles.tinuAvatarText}>T</Text>
                        </View>
                        <View style={styles.tinuText}>
                            <Text style={styles.tinuTitle}>Ask Tinu</Text>
                            <Text style={styles.tinuSubtitle}>AI Assistant</Text>
                        </View>
                        <View style={styles.tinuPulse} />
                    </View>
                </TouchableOpacity>
            </Animated.View>

            {/* Full Screen Card Modal */}
            <FullScreenCardModal />

            {/* Tinu Bottom Sheet */}
            <TinuBottomSheet
                visible={showBottomSheet}
                cards={tinuData.cards}
                chips={tinuData.chips}
                onChipPress={handleChipPress}
                onSendMessage={handleSendMessage}
                inputText={inputText}
                setInputText={setInputText}
                onClose={handleCloseBottomSheet}
            />
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
    loadingCard: {
        backgroundColor: '#FFFFFF',
        padding: 32,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    loadingEmoji: {
        fontSize: 48,
        marginBottom: 16,
    },
    loadingText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 8,
    },
    loadingSubtext: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B',
    },
    viewModeContainer: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        padding: 4,
    },
    viewModeButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    viewModeButtonActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    viewModeIcon: {
        fontSize: 16,
        opacity: 0.6,
    },
    viewModeIconActive: {
        opacity: 1,
    },
    categoriesScroll: {
        marginHorizontal: -20,
    },
    categoriesContainer: {
        paddingHorizontal: 20,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    categoryChipActive: {
        backgroundColor: '#6366F1',
        borderColor: '#6366F1',
    },
    categoryIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    categoryLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#475569',
        marginRight: 8,
    },
    categoryLabelActive: {
        color: '#FFFFFF',
    },
    categoryCount: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    categoryCountActive: {
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    categoryCountText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
    },
    cardsContainer: {
        padding: 16,
    },
    statsBar: {
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        alignItems: 'center',
    },
    statsText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6366F1',
    },
    flashCardContainer: {
        marginBottom: 16,
    },
    enhancedFlashCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#8B5CF6',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardNumber: {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    cardNumberText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#8B5CF6',
    },
    cardActionsSmall: {
        flexDirection: 'row',
    },
    actionButtonSmall: {
        padding: 6,
    },
    actionIcon: {
        fontSize: 16,
        opacity: 0.6,
    },
    questionSection: {
        marginBottom: 16,
    },
    questionLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#8B5CF6',
        marginBottom: 8,
        letterSpacing: 1,
    },
    questionText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
        lineHeight: 24,
    },
    answerSection: {
        marginBottom: 16,
    },
    answerLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6366F1',
        marginBottom: 8,
        letterSpacing: 1,
    },
    answerText: {
        fontSize: 15,
        color: '#475569',
        lineHeight: 22,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    difficulty: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    difficultyDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
        marginRight: 6,
    },
    difficultyText: {
        fontSize: 12,
        color: '#64748B',
    },
    cardTime: {
        fontSize: 12,
        color: '#94A3B8',
        fontStyle: 'italic',
    },

    // Modal Styles
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalContent: {
        width: SCREEN_WIDTH * 0.9,
        maxHeight: SCREEN_HEIGHT * 0.8,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        color: '#64748B',
        fontWeight: '300',
    },
    flipContainer: {
        height: 300,
        margin: 20,
    },
    cardFace: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backfaceVisibility: 'hidden',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    cardFront: {
        backgroundColor: '#8B5CF6',
    },
    cardBack: {
        backgroundColor: '#6366F1',
        transform: [{ rotateY: '180deg' }],
    },
    cardContent: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardType: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.8)',
        letterSpacing: 2,
        marginBottom: 16,
    },
    cardMainText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 32,
        flex: 1,
        textAlignVertical: 'center',
    },
    flipHint: {
        alignItems: 'center',
    },
    flipHintText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 4,
    },
    flipHintIcon: {
        fontSize: 20,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    actionButton: {
        alignItems: 'center',
        padding: 12,
    },
    actionText: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 4,
    },
    progressSection: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    progressText: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 8,
    },
    progressBar: {
        height: 4,
        backgroundColor: '#F1F5F9',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#8B5CF6',
        borderRadius: 2,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyEmoji: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
    },
    tinuButtonContainer: {
        position: 'absolute',
        bottom: 24,
        right: 24,
    },
    enhancedTinuButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    tinuButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tinuAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    tinuAvatarText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    tinuText: {
        marginRight: 12,
    },
    tinuTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 2,
    },
    tinuSubtitle: {
        fontSize: 12,
        color: '#64748B',
    },
    tinuPulse: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#10B981',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 4,
    },
};

import { StyleSheet } from 'react-native';

export default FlashCardScreen;
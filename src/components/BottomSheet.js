import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Modal,
    Animated,
    PanResponder,
    Dimensions,
    Image,
    Easing
} from 'react-native';
import { globalStyles, colors } from '../styles/global';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const TinuBottomSheet = (props) => {
    const {
        visible = false,
        cards = [],
        chips = [],
        onChipPress,
        onSendMessage,
        inputText,
        setInputText,
        onClose
    } = props;

    const [animation] = useState(new Animated.Value(0));
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(50));

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(animation, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 70,
                    friction: 10,
                    restDisplacementThreshold: 0.1,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.cubic)
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.back(1.5))
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.spring(animation, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 70,
                    friction: 10
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [visible]);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (e, gestureState) => {
            if (gestureState.dy > 0) {
                animation.setValue(1 - gestureState.dy / SCREEN_HEIGHT);
            }
        },
        onPanResponderRelease: (e, gestureState) => {
            if (gestureState.dy > 150 || gestureState.vy > 0.5) {
                onClose && onClose();
            } else {
                Animated.spring(animation, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 7
                }).start();
            }
        }
    });

    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [SCREEN_HEIGHT, 0]
    });

    const backdropOpacity = fadeAnim;
    const contentSlide = slideAnim;

    // Enhanced card with gradient and better styling
    const EnhancedCard = ({ item, index }) => (
        <Animated.View
            style={[
                styles.enhancedCard,
                {
                    transform: [{ translateY: contentSlide }],
                    opacity: fadeAnim,
                    marginBottom: 12
                }
            ]}
        >
            {/* Card Header */}
            <View style={styles.cardHeader}>
                <View style={styles.cardIcon}>
                    <Text style={styles.cardIconText}>💡</Text>
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
            </View>

            {/* Card Content */}
            <Text style={styles.cardContent}>{item.content}</Text>

            {/* Card Footer */}
            <View style={styles.cardFooter}>
                <View style={styles.cardPill}>
                    <Text style={styles.cardPillText}>Tip #{index + 1}</Text>
                </View>
                <Text style={styles.cardTime}>Just now</Text>
            </View>
        </Animated.View>
    );

    // Enhanced chip with better interaction
    const EnhancedChip = ({ item, index }) => (
        <Animated.View
            style={{
                transform: [{ scale: fadeAnim }],
                opacity: fadeAnim,
            }}
        >
            <TouchableOpacity
                style={styles.enhancedChip}
                onPress={() => onChipPress && onChipPress(item)}
                activeOpacity={0.7}
            >
                <Text style={styles.chipText}>💬 {item.label}</Text>
            </TouchableOpacity>
        </Animated.View>
    );

    const renderCard = ({ item, index }) => (
        <EnhancedCard item={item} index={index} />
    );

    const renderChip = ({ item, index }) => (
        <EnhancedChip item={item} index={index} />
    );

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            {/* Enhanced Backdrop with blur effect simulation */}
            <Animated.View
                style={[
                    styles.backdrop,
                    { opacity: backdropOpacity }
                ]}
            >
                <TouchableOpacity
                    style={styles.backdropTouchable}
                    activeOpacity={1}
                    onPress={onClose}
                />
            </Animated.View>

            {/* Main Bottom Sheet Content */}
            <Animated.View
                style={[
                    styles.bottomSheet,
                    {
                        transform: [{ translateY }],
                        height: SCREEN_HEIGHT * 0.85
                    }
                ]}
                {...panResponder.panHandlers}
            >
                {/* Enhanced Drag Handle */}
                <View style={styles.dragHandleContainer}>
                    <View style={styles.dragHandle} />
                </View>

                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>T</Text>
                    </View>
                    <View style={styles.headerText}>
                        <Text style={styles.headerTitle}>Tinu Assistant</Text>
                        <Text style={styles.headerSubtitle}>Always here to help! 🎯</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={styles.closeButtonText}>×</Text>
                    </TouchableOpacity>
                </View>

                {/* Cards Section with animated entrance */}
                <View style={styles.cardsContainer}>
                    <Text style={styles.sectionTitle}>Quick Insights</Text>
                    <FlatList
                        data={cards}
                        renderItem={renderCard}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <Animated.View
                                style={[
                                    styles.emptyState,
                                    { opacity: fadeAnim }
                                ]}
                            >
                                <Text style={styles.emptyStateEmoji}>🤖</Text>
                                <Text style={styles.emptyStateText}>
                                    No insights available right now
                                </Text>
                            </Animated.View>
                        }
                    />
                </View>

                {/* Chips Section */}
                {chips.length > 0 && (
                    <View style={styles.chipsSection}>
                        <Text style={styles.sectionTitle}>Quick Questions</Text>
                        <FlatList
                            data={chips}
                            renderItem={renderChip}
                            keyExtractor={item => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.chipsContainer}
                        />
                    </View>
                )}

                {/* Enhanced Input Section */}
                <Animated.View
                    style={[
                        styles.inputContainer,
                        {
                            transform: [{ translateY: contentSlide }],
                            opacity: fadeAnim
                        }
                    ]}
                >
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.enhancedInput}
                            placeholder="Ask Tinu anything about parenting..."
                            placeholderTextColor="#94A3B8"
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            maxLength={500}
                        />
                        <View style={styles.inputActions}>
                            {inputText.length > 0 && (
                                <TouchableOpacity
                                    style={styles.clearButton}
                                    onPress={() => setInputText('')}
                                >
                                    <Text style={styles.clearButtonText}>✕</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={[
                                    styles.sendButton,
                                    !inputText.trim() && styles.sendButtonDisabled
                                ]}
                                onPress={onSendMessage}
                                disabled={!inputText.trim()}
                            >
                                <Text style={styles.sendButtonText}>↑</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {inputText.length > 0 && (
                        <Text style={styles.charCount}>
                            {inputText.length}/500
                        </Text>
                    )}
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

const styles = {
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    backdropTouchable: {
        flex: 1,
    },
    bottomSheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 16,
    },
    dragHandleContainer: {
        alignItems: 'center',
        marginBottom: 8,
    },
    dragHandle: {
        width: 48,
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 8,
    },
    avatar: {
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
        elevation: 4,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerText: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 2,
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
        fontSize: 20,
        color: '#64748B',
        fontWeight: '300',
        lineHeight: 20,
    },
    cardsContainer: {
        flex: 1,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    enhancedCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 4,
        borderLeftWidth: 4,
        borderLeftColor: '#6366F1',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardIconText: {
        fontSize: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
        flex: 1,
    },
    cardContent: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardPill: {
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    cardPillText: {
        fontSize: 12,
        color: '#6366F1',
        fontWeight: '500',
    },
    cardTime: {
        fontSize: 12,
        color: '#94A3B8',
    },
    chipsSection: {
        marginBottom: 16,
    },
    chipsContainer: {
        paddingHorizontal: 4,
    },
    enhancedChip: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    chipText: {
        color: '#475569',
        fontSize: 14,
        fontWeight: '500',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    enhancedInput: {
        flex: 1,
        fontSize: 16,
        color: '#1E293B',
        maxHeight: 100,
        paddingRight: 8,
    },
    inputActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    clearButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearButtonText: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: 'bold',
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    sendButtonDisabled: {
        backgroundColor: '#CBD5E1',
        shadowColor: 'transparent',
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    charCount: {
        fontSize: 12,
        color: '#94A3B8',
        textAlign: 'right',
        marginTop: 4,
        marginRight: 4,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    emptyStateEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 24,
    },
};

// Add StyleSheet
import { StyleSheet } from 'react-native';

export default TinuBottomSheet;
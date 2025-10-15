import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import TinuBottomSheet from '../components/BottomSheet/TinuBottomSheet';
import { apiService } from '../services/api';

const DidYouKnowScreen = () => {
    const [dykCards, setDykCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tinuVisible, setTinuVisible] = useState(false);
    const [tinuData, setTinuData] = useState({ cards: [], chips: [] });

    useEffect(() => {
        loadDidYouKnowData();
    }, []);

    const loadDidYouKnowData = async () => {
        try {
            setLoading(true);
            const data = await apiService.getPersonalizedAnswers();
            console.log('DYK Data:', data);
            setDykCards(data.dyk_cards || []);
        } catch (error) {
            console.error('Error loading DYK data:', error);
            // Fallback mock data matching API structure
            setDykCards([
                {
                    fact_text: "Children learn best through play-based activities that engage multiple senses.",
                    supporting_resources: ["Sensory Play Guide", "Age-appropriate Activities"]
                },
                {
                    fact_text: "Reading aloud to children for 15 minutes daily can significantly improve their language skills.",
                    supporting_resources: ["Recommended Book List", "Reading Techniques"]
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleAskTinu = async () => {
        try {
            const data = await apiService.activateTinu('did_you_know');
            setTinuData({
                cards: data.cards || [],
                chips: data.chips || []
            });
            setTinuVisible(true);
        } catch (error) {
            console.error('Error activating Tinu:', error);
            // Fallback mock data
            setTinuData({
                cards: [
                    {
                        title: "Learning Tip",
                        content: "Did you know that consistent routines help children feel secure and learn better?",
                        image_url: null
                    }
                ],
                chips: [
                    { text: "More learning tips" },
                    { text: "Activity suggestions" },
                    { text: "Development milestones" }
                ]
            });
            setTinuVisible(true);
        }
    };

    const handleSendMessage = (message) => {
        console.log('Message sent to Tinu:', message);
        Alert.alert('Message Sent', `"${message}"\n\nNote: Chat API is not implemented yet. This is a demo.`);
    };

    const handleChipPress = (chip) => {
        handleSendMessage(chip.text || chip.label || chip);
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading educational content...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.title}>Did You Know?</Text>
                <Text style={styles.subtitle}>
                    Discover interesting facts about child development and parenting.
                </Text>

                {dykCards.map((card, index) => (
                    <View key={index} style={styles.card}>
                        <Text style={styles.cardTitle}>💡 Did You Know?</Text>
                        <Text style={styles.cardContent}>{card.fact_text || card.content}</Text>

                        {card.supporting_resources && card.supporting_resources.length > 0 && (
                            <View style={styles.resourcesContainer}>
                                <Text style={styles.resourcesTitle}>Supporting Resources:</Text>
                                {card.supporting_resources.map((resource, idx) => (
                                    <Text key={idx} style={styles.resourceItem}>• {resource}</Text>
                                ))}
                            </View>
                        )}
                    </View>
                ))}

                <TouchableOpacity style={styles.tinuButton} onPress={handleAskTinu}>
                    <Text style={styles.tinuButtonText}>Ask Tinu 🤖</Text>
                </TouchableOpacity>
            </ScrollView>

            <TinuBottomSheet
                isVisible={tinuVisible}
                onClose={() => setTinuVisible(false)}
                cards={tinuData.cards}
                chips={tinuData.chips}
                onChipPress={handleChipPress}
                onSendMessage={handleSendMessage}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContainer: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 12,
    },
    cardContent: {
        fontSize: 16,
        color: '#333333',
        lineHeight: 24,
        marginBottom: 12,
    },
    resourcesContainer: {
        backgroundColor: '#E8F4FD',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    resourcesTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#007AFF',
        marginBottom: 6,
    },
    resourceItem: {
        fontSize: 14,
        color: '#007AFF',
        lineHeight: 20,
    },
    tinuButton: {
        backgroundColor: '#5856D6',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    tinuButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingText: {
        fontSize: 16,
        color: '#666666',
        marginTop: 16,
    },
});

export default DidYouKnowScreen;
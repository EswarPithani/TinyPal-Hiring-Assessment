import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { globalStyles, colors, responsive } from '../styles/global';

const { scaleSize, scaleFont, screenSize } = responsive;

const Card = ({ item, type = 'dyk', onPress }) => {
    const isFlashCard = type === 'flashcard';
    const [imageLoading, setImageLoading] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Handle both our expected structure and actual API structure
    const title = item.title || item.heading || (isFlashCard ? 'Question' : 'Did You Know');
    const content = isFlashCard ? (item.answer || item.content || '') : (item.content || '');
    const question = item.question || item.heading || '';

    const handleImageLoadStart = () => {
        setImageLoading(true);
        setImageError(false);
    };

    const handleImageLoadEnd = () => {
        setImageLoading(false);
    };

    const handleImageError = () => {
        setImageLoading(false);
        setImageError(true);
        console.log('Image failed to load:', item.image_url);
    };

    // Responsive image height
    const imageHeight = screenSize.isTablet ? scaleSize(250) : scaleSize(200);

    return (
        <TouchableOpacity
            style={[
                globalStyles.card,
                {
                    // Additional responsive adjustments
                    marginHorizontal: screenSize.isTablet ? scaleSize(8) : 0,
                }
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {item.image_url && (
                <View style={{ position: 'relative', marginBottom: scaleSize(12) }}>
                    <Image
                        source={{ uri: item.image_url }}
                        style={{
                            width: '100%',
                            height: imageHeight,
                            borderRadius: scaleSize(8),
                        }}
                        resizeMode="cover"
                        onLoadStart={handleImageLoadStart}
                        onLoadEnd={handleImageLoadEnd}
                        onError={handleImageError}
                    />

                    {imageLoading && (
                        <View style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            borderRadius: scaleSize(8),
                        }}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    )}

                    {imageError && (
                        <View style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#F1F5F9',
                            borderRadius: scaleSize(8),
                        }}>
                            <Text style={{
                                color: colors.textSecondary,
                                fontSize: scaleFont(14),
                                textAlign: 'center',
                                padding: scaleSize(8),
                            }}>
                                🖼️ Image not available
                            </Text>
                        </View>
                    )}
                </View>
            )}

            <Text style={[globalStyles.subtitle, { marginBottom: scaleSize(8) }]}>
                {isFlashCard ? 'Question:' : title}
            </Text>

            <Text style={[globalStyles.bodyText, { marginBottom: scaleSize(12) }]}>
                {isFlashCard ? question : content}
            </Text>

            {isFlashCard && content && (
                <>
                    <Text style={[globalStyles.subtitle, {
                        marginTop: scaleSize(8),
                        marginBottom: scaleSize(4),
                    }]}>
                        Answer:
                    </Text>
                    <Text style={globalStyles.bodyText}>
                        {content}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

export default Card;
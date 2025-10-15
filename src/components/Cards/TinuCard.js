import React from 'react';
import { View, Text, Image } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';

const TinuCard = ({ card }) => {
    if (!card) return null;

    return (
        <View style={[globalStyles.card, { marginBottom: 12 }]}>
            {card.title && (
                <Text style={[globalStyles.subtitle, { color: '#5856D6' }]}>
                    {card.title}
                </Text>
            )}

            {card.content && (
                <Text style={globalStyles.bodyText}>
                    {card.content}
                </Text>
            )}

            {card.image_url && (
                <Image
                    source={{ uri: card.image_url }}
                    style={{
                        width: '100%',
                        height: 150,
                        borderRadius: 8,
                        marginTop: 8
                    }}
                    resizeMode="cover"
                />
            )}
        </View>
    );
};

export default TinuCard;
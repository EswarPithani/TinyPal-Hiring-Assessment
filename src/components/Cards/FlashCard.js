import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';

class FlashCard extends Component {
    constructor(props) {
        super(props);
        this.state = { isFlipped: false };
        this.flipAnimation = new Animated.Value(0);
    }

    flipCard = () => {
        const { isFlipped } = this.state;
        Animated.timing(this.flipAnimation, {
            toValue: isFlipped ? 0 : 180,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            this.setState({ isFlipped: !isFlipped });
        });
    };

    render() {
        const { card } = this.props;
        const { isFlipped } = this.state;

        const frontInterpolate = this.flipAnimation.interpolate({
            inputRange: [0, 180],
            outputRange: ['0deg', '180deg'],
        });

        const backInterpolate = this.flipAnimation.interpolate({
            inputRange: [0, 180],
            outputRange: ['180deg', '360deg'],
        });

        const frontAnimatedStyle = { transform: [{ rotateY: frontInterpolate }] };
        const backAnimatedStyle = { transform: [{ rotateY: backInterpolate }] };

        return (
            <TouchableOpacity onPress={this.flipCard} activeOpacity={0.9}>
                <View>
                    <Animated.View style={[globalStyles.card, frontAnimatedStyle]}>
                        <Text style={[globalStyles.subtitle, { color: '#FF9500' }]}>
                            Question
                        </Text>
                        <Text style={[globalStyles.bodyText, { marginTop: 8 }]}>
                            {card.question || card.front}
                        </Text>
                        <Text style={[globalStyles.bodyText, { marginTop: 12, fontSize: 14, color: '#666' }]}>
                            Tap to reveal answer
                        </Text>
                    </Animated.View>

                    <Animated.View
                        style={[
                            globalStyles.card,
                            backAnimatedStyle,
                            { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#E8F4FD' }
                        ]}
                    >
                        <Text style={[globalStyles.subtitle, { color: '#007AFF' }]}>
                            Answer
                        </Text>
                        <Text style={[globalStyles.bodyText, { marginTop: 8 }]}>
                            {card.answer || card.back}
                        </Text>
                        <Text style={[globalStyles.bodyText, { marginTop: 12, fontSize: 14, color: '#666' }]}>
                            Tap to see question
                        </Text>
                    </Animated.View>
                </View>
            </TouchableOpacity>
        );
    }
}

export default FlashCard;

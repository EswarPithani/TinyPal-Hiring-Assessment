import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';

const ChatInput = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
            <TextInput
                style={[
                    globalStyles.input,
                    {
                        flex: 1,
                        marginRight: 8,
                        paddingVertical: 12
                    }
                ]}
                placeholder="Ask me Anything..."
                value={message}
                onChangeText={setMessage}
                multiline
            />
            <TouchableOpacity
                style={[
                    globalStyles.button,
                    {
                        paddingHorizontal: 20,
                        paddingVertical: 12,
                        minWidth: 60
                    }
                ]}
                onPress={handleSend}
            >
                <Text style={globalStyles.buttonText}>Send</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ChatInput;
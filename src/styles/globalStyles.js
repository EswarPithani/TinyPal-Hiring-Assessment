import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    screenContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F8F9FA',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 12,
    },
    bodyText: {
        fontSize: 16,
        color: '#666666',
        lineHeight: 22,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    chip: {
        backgroundColor: '#E8F4FD',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        margin: 4,
    },
    chipText: {
        color: '#007AFF',
        fontSize: 14,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#FFFFFF',
    },
    // Responsive design helpers
    responsiveWidth: {
        width: width > 400 ? '90%' : '95%',
    },
    responsivePadding: {
        paddingHorizontal: width > 400 ? 20 : 16,
    },
});
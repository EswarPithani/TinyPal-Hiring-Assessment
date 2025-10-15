import { StyleSheet, Dimensions } from 'react-native';
import responsive, { spacing, fontSizes, screenSize } from '../utils/responsive';

const { scaleSize, scaleFont, SCREEN_WIDTH, SCREEN_HEIGHT } = responsive;

export const colors = {
    primary: '#6366F1',
    secondary: '#8B5CF6',
    background: '#F8FAFC',
    cardBackground: '#FFFFFF',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    accent: '#F59E0B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
};

// Responsive global styles
export const globalStyles = StyleSheet.create({
    // Container styles
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    screenContainer: {
        flex: 1,
        padding: spacing.md,
    },

    // Card styles with responsive adjustments
    card: {
        backgroundColor: colors.cardBackground,
        borderRadius: scaleSize(12),
        padding: spacing.md,
        marginVertical: spacing.sm,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: scaleSize(2),
        },
        shadowOpacity: 0.1,
        shadowRadius: scaleSize(3.84),
        elevation: 5,
        // Responsive width for tablets
        ...(screenSize.isTablet && {
            maxWidth: SCREEN_WIDTH * 0.8,
            alignSelf: 'center',
        }),
    },

    // Typography with responsive font sizes
    title: {
        fontSize: fontSizes.xxxl,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
        // Adjust line height for accessibility
        lineHeight: scaleFont(40),
    },

    subtitle: {
        fontSize: fontSizes.xl,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
        lineHeight: scaleFont(28),
    },

    bodyText: {
        fontSize: fontSizes.base,
        color: colors.textSecondary,
        lineHeight: scaleFont(24),
    },

    caption: {
        fontSize: fontSizes.small,
        color: colors.textSecondary,
        lineHeight: scaleFont(20),
    },

    // Button styles with responsive sizing
    button: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: scaleSize(8),
        alignItems: 'center',
        marginVertical: spacing.sm,
        minHeight: scaleSize(48), // Minimum touch target size
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: fontSizes.base,
        fontWeight: '600',
        textAlign: 'center',
    },

    // Input styles
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: scaleSize(8),
        padding: spacing.md,
        fontSize: fontSizes.base,
        backgroundColor: colors.cardBackground,
        minHeight: scaleSize(48), // Minimum touch target
    },

    // Layout utilities
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    spaceBetween: {
        justifyContent: 'space-between',
    },

    // Responsive spacing
    p: {
        xs: { padding: spacing.xs },
        sm: { padding: spacing.sm },
        md: { padding: spacing.md },
        lg: { padding: spacing.lg },
        xl: { padding: spacing.xl },
    },

    m: {
        xs: { margin: spacing.xs },
        sm: { margin: spacing.sm },
        md: { margin: spacing.md },
        lg: { margin: spacing.lg },
        xl: { margin: spacing.xl },
    },

    // Responsive grid columns for tablets
    grid: {
        container: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginHorizontal: -spacing.sm,
        },
        column: {
            paddingHorizontal: spacing.sm,
            marginBottom: spacing.md,
            ...(screenSize.isTablet && {
                width: '50%',
            }),
            ...(screenSize.isLargeTablet && {
                width: '33.333%',
            }),
        },
    },
});

export { responsive, spacing, fontSizes, screenSize };
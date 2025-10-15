import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Based on iPhone 14 Pro scale (393x852)
const guidelineBaseWidth = 393;
const guidelineBaseHeight = 852;

// Screen size classification
export const screenSize = {
    isSmallDevice: SCREEN_WIDTH < 375,
    isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
    isLargeDevice: SCREEN_WIDTH >= 414,
    isTablet: SCREEN_WIDTH >= 768,
    isLargeTablet: SCREEN_WIDTH >= 1024,
};

// Responsive width scale
export const scaleWidth = (size) => {
    const scaleFactor = SCREEN_WIDTH / guidelineBaseWidth;
    const scaledSize = size * scaleFactor;

    // For tablets, don't scale up as much
    if (screenSize.isTablet) {
        return Math.min(scaledSize, size * 1.2);
    }

    return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
};

// Responsive height scale
export const scaleHeight = (size) => {
    const scaleFactor = SCREEN_HEIGHT / guidelineBaseHeight;
    const scaledSize = size * scaleFactor;

    if (screenSize.isTablet) {
        return Math.min(scaledSize, size * 1.2);
    }

    return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
};

// Responsive font size with accessibility support
export const scaleFont = (size) => {
    const scaleFactor = Math.min(SCREEN_WIDTH / guidelineBaseWidth, 1.5); // Cap scaling at 1.5x
    const scaledSize = size * scaleFactor;

    // Adjust for different device sizes
    let adjustedSize = scaledSize;

    if (screenSize.isSmallDevice) {
        adjustedSize = scaledSize * 0.9;
    } else if (screenSize.isTablet) {
        adjustedSize = scaledSize * 1.1;
    }

    return Math.round(PixelRatio.roundToNearestPixel(adjustedSize));
};

// Responsive padding/margin
export const scaleSize = (size) => {
    return scaleWidth(size);
};

// Platform specific adjustments
export const platformAdjust = (iosSize, androidSize = iosSize) => {
    return Platform.OS === 'ios' ? iosSize : androidSize;
};

// Dynamic spacing based on screen size
export const spacing = {
    xs: scaleSize(4),
    sm: scaleSize(8),
    md: scaleSize(16),
    lg: scaleSize(24),
    xl: scaleSize(32),
    xxl: scaleSize(48),
};

// Dynamic font sizes
export const fontSizes = {
    micro: scaleFont(10),
    tiny: scaleFont(12),
    small: scaleFont(14),
    base: scaleFont(16),
    medium: scaleFont(18),
    large: scaleFont(20),
    xl: scaleFont(24),
    xxl: scaleFont(28),
    xxxl: scaleFont(32),
    huge: scaleFont(36),
};

// Dynamic icon sizes
export const iconSizes = {
    xs: scaleSize(16),
    sm: scaleSize(20),
    md: scaleSize(24),
    lg: scaleSize(32),
    xl: scaleSize(40),
    xxl: scaleSize(48),
};

export default {
    scaleWidth,
    scaleHeight,
    scaleFont,
    scaleSize,
    platformAdjust,
    screenSize,
    spacing,
    fontSizes,
    iconSizes,
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
};
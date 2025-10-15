const BASE_URL = 'https://genai-images-4ea9c0ca90c8.herokuapp.com';

export const apiService = {
    async getPersonalizedAnswers() {
        const body = {
            module_id: "1",
            parent_id: "EXAMPLEPARENT",
            child_id: "EXAMPLECHILD",
            responses: [
                {
                    question_id: "q006_tantrums",
                    selected_choice_ids: ["choice_b", "choice_c"],
                    open_response_text: "",
                    timestamp: "2025-10-14T07:25:31.482Z"
                },
                {
                    question_id: "q009_language_dev",
                    selected_choice_ids: ["choice_c", "choice_a"],
                    open_response_text: "",
                    timestamp: "2025-10-14T07:25:31.482Z"
                },
                {
                    question_id: "q008_development_concerns",
                    selected_choice_ids: ["open_response"],
                    open_response_text: "His cognitive abilities being stunted by overuse of mobiles",
                    timestamp: "2025-10-14T07:25:31.482Z"
                }
            ]
        };

        try {
            console.log('Making API call to /p13n_answers...');
            const response = await fetch(`${BASE_URL}/p13n_answers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('API Response data received successfully');

            // Transform the API response to match our app's expected structure
            return transformPersonalizedResponse(responseData);

        } catch (error) {
            console.error('API Error:', error);
            // Return mock data only for network errors
            if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
                return getMockPersonalizedData();
            }
            throw error;
        }
    },

    async activateTinu(context = 'flash_card') {
        const body = {
            child_id: "EXAMPLECHILD",
            context: context,
            module_id: "1",
            topic: "nutrition_impacts_mood"
        };

        try {
            console.log('Making API call to /activate_tinu...');
            const response = await fetch(`${BASE_URL}/activate_tinu`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('Tinu API Response data received successfully');

            // Transform the API response to match our app's expected structure
            return transformTinuResponse(responseData);

        } catch (error) {
            console.error('API Error:', error);
            // Return mock data only for network errors
            if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
                return getMockTinuData();
            }
            throw error;
        }
    }
};

// Helper function to transform personalized answers response
function transformPersonalizedResponse(apiData) {
    console.log('=== IMAGE CONTENT RELATIONSHIP ANALYSIS ===');

    // Transform dyk_cards
    const transformedDykCards = (apiData.dyk_cards || []).map((card, index) => {
        const fullImageUrl = getFullImageUrl(card.image_url);

        // Log the relationship between content and image
        console.log(`Card ${index + 1}:`);
        console.log(`  Title: ${card.title || card.heading}`);
        console.log(`  Content: ${card.content.substring(0, 50)}...`);
        console.log(`  Image Path: ${card.image_url}`);
        console.log(`  Full Image URL: ${fullImageUrl}`);
        console.log('  ---');

        return {
            id: card.id || `dyk_${Date.now()}_${index}`,
            title: card.title || card.heading || 'Did You Know',
            content: card.content || '',
            image_url: fullImageUrl,
            heading: card.heading,
            sub_heading: card.sub_heading
        };
    });

    // Transform flash_cards
    const transformedFlashCards = (apiData.flash_cards || []).map((card, index) => {
        const fullImageUrl = getFullImageUrl(card.image_url);

        console.log(`Flash Card ${index + 1}:`);
        console.log(`  Title: ${card.title || card.heading}`);
        console.log(`  Content: ${card.content.substring(0, 50)}...`);
        console.log(`  Image Path: ${card.image_url}`);
        console.log(`  Full Image URL: ${fullImageUrl}`);
        console.log('  ---');

        return {
            id: card.id || `flash_${Date.now()}_${index}`,
            question: card.title || card.heading || 'Question',
            answer: card.content || '',
            image_url: fullImageUrl,
            heading: card.heading,
            sub_heading: card.sub_heading
        };
    });

    console.log('=== END ANALYSIS ===');

    return {
        dyk_cards: transformedDykCards,
        flash_cards: transformedFlashCards,
        title: apiData.title,
        subtitle: apiData.subtitle,
        cta: apiData.cta
    };
}

// Helper function to get full image URL
function getFullImageUrl(imagePath) {
    if (!imagePath) return null;

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
        return imagePath;
    }

    // If it's a relative path, prepend the base URL
    if (imagePath.startsWith('/')) {
        return `${BASE_URL}${imagePath}`;
    }

    // If it's just a filename, construct the full URL
    return `${BASE_URL}/images/${imagePath}`;
}

// Helper function to transform Tinu response
function transformTinuResponse(apiData) {
    // Transform Tinu cards if they have images
    const transformedCards = (apiData.cards || []).map(card => ({
        ...card,
        image_url: getFullImageUrl(card.image_url)
    }));

    return {
        cards: transformedCards,
        chips: apiData.chips || []
    };
}

// Mock data fallbacks
function getMockPersonalizedData() {
    return {
        dyk_cards: [
            {
                id: '1',
                title: 'Did You Know?',
                content: 'Children learn best through play and exploration in their early years.',
                image_url: null
            },
            {
                id: '2',
                title: 'Parenting Tip',
                content: 'Reading to your child for 15 minutes daily can significantly improve their language skills.',
                image_url: null
            }
        ],
        flash_cards: [
            {
                id: '1',
                question: 'What is the best way to handle tantrums?',
                answer: 'Stay calm, acknowledge feelings, and provide comfort while setting clear boundaries.',
                image_url: null
            },
            {
                id: '2',
                question: 'How much screen time is recommended?',
                answer: 'For children 2-5 years, limit to 1 hour per day of high-quality programming.',
                image_url: null
            }
        ]
    };
}

function getMockTinuData() {
    return {
        cards: [
            {
                id: '1',
                title: 'Tinu Tip',
                content: 'Nutrition plays a key role in your child\'s mood and behavior.',
                type: 'tip'
            }
        ],
        chips: [
            { id: '1', label: 'Nutrition Tips' },
            { id: '2', label: 'Sleep Schedule' },
            { id: '3', label: 'Learning Activities' },
            { id: '4', label: 'Behavior Management' }
        ]
    };
}
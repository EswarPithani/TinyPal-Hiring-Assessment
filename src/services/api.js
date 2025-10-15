import axios from 'axios';

const BASE_URL = 'https://genai-images-4ea9c0ca90c8.herokuapp.com';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const apiService = {
    // Get Did You Know and Flash Cards data
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
            const response = await api.post('/p13n_answers', body);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Activate Tinu for bottom sheet
    async activateTinu(context = "flash_card") {
        const body = {
            child_id: "EXAMPLECHILD",
            context: context,
            module_id: "1",
            topic: "nutrition_impacts_mood"
        };

        try {
            const response = await api.post('/activate_tinu', body);
            return response.data;
        } catch (error) {
            console.error('Tinu API Error:', error);
            throw error;
        }
    }
};

export default apiService;
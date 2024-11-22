document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('coverLetterForm');
    const result = document.getElementById('result');
    const coverLetterTextarea = document.getElementById('coverLetter');
    const copyButton = document.getElementById('copyButton');
    const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const resumeText = document.getElementById('resumeText').value;
        const jobDescription = document.getElementById('jobDescription').value;

        try {
            const coverLetter = await generateCoverLetter(resumeText, jobDescription);
            coverLetterTextarea.value = coverLetter;
            result.style.display = 'block';
        } catch (error) {
            console.error('Error generating cover letter:', error);
            coverLetterTextarea.value = 'An error occurred while generating the cover letter. Please try again.';
            result.style.display = 'block';
        }
    });

    copyButton.addEventListener('click', function() {
        coverLetterTextarea.select();
        document.execCommand('copy');
    });

    async function generateCoverLetter(resumeText, jobDescription) {
        const API_KEY = 'YOUR_OPENAI_API_KEY';
        
        const messages = [
            {
                role: "system",
                content: "You are a helpful assistant that writes professional cover letters based on a resume and job description."
            },
            {
                role: "user",
                content: `Generate a professional cover letter based on the following resume text and job description:\n\nResume:\n${resumeText}\n\nJob Description:\n${jobDescription}\n\nThe letter should be concise, engaging, and highlight how the skills in the resume align with the job requirements.`
            }
        ];

        try {
            const response = await fetch(OPENAI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: messages,
                    max_tokens: 800,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                console.log(`Error Status: ${response.status}`);
                console.log(`Error Text: ${await response.text()}`);
                throw new Error('Failed to generate cover letter');
            }

            const data = await response.json();
            return data.choices[0].message.content.trim();
        } catch (error) {
            console.error('Error generating cover letter:', error);
            throw error;
        }
    }
});
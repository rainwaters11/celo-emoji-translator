// This special line tells React that this component should run in the 'client' (browser) environment.
"use client";

// We need React to build our interactive webpage parts.
import React, { useState, ChangeEvent } from 'react';

// Our Emoji Translator App component
function EmojiTranslatorApp() {
    // These are special "variables" for React that remember things.
    // `inputText` will hold what you type.
    // `setInputValue` is how we change `inputText`.
    // `''` means it starts empty.
    const [inputText, setInputText] = useState('');

    // `translatedEmoji` will hold our emoji message.
    // `setTranslatedEmoji` is how we change `translatedEmoji`.
    // `''` means it starts empty.
    const [translatedEmoji, setTranslatedEmoji] = useState('');

    // This is our secret codebook for translating letters to emojis!
    // We'll use Celo-themed emojis!
    const emojiMap: Record<string, string> = {
        'a': '🌳', 'b': '💰', 'c': '🌟', 'd': '📱', 'e': '💚',
        'f': '🍃', 'g': '✨', 'h': '🌱', 'i': '💡', 'j': '🔗',
        'k': '💎', 'l': '🚀', 'm': '🌎', 'n': '🌈', 'o': '💡',
        'p': '⚡', 'q': '🔑', 'r': '🔄', 's': '✨', 't': '⏱️',
        'u': '🤝', 'v': '📈', 'w': '🌐', 'x': '🛑', 'y': '✅',
        'z': '💡',
        // Also map some numbers and common punctuation
        '0': '0️⃣', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣', '4': '4️⃣',
        '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣',
        '!': '❗️', '?': '❓', '.': '▪️', ',': '▪️', ' ': '〰️', // Space gets a wave
        // Common Celo words (longer words get special treatment!)
        'celo': '💚🌳💰🌟', // A special emoji combo for "celo"
        'minipay': '📱💸✨', // A special combo for "minipay"
        'hello': '👋🌎',
        'world': '🌍🌐',
        'blockchain': '🔗⛓️',
        'money': '💰💸',
        'coin': '🪙✨',
    };

    // This function does the actual translating!
    const translateToEmoji = (text: string): string => {
        let result = text.toLowerCase(); // Convert everything to lowercase first

        // Handle multi-character words first to avoid partial matches
        for (const word in emojiMap) {
            // If the word is longer than 1 character and exists in our map
            if (word.length > 1 && result.includes(word)) {
                // Replace the word with its emoji combo
                // We use a regular expression with 'g' to replace ALL occurrences
                result = result.replace(new RegExp(word, 'g'), emojiMap[word]);
                // Ensure emojis for words aren't then split into individual chars
                // This is a simple approach, more robust would involve tokenization
            }
        }

        // Now, go through character by character for single letters/symbols
        let finalEmojiString = '';
        for (let i = 0; i < result.length; i++) {
            const char = result[i];
            // If we find the character in our emojiMap, use its emoji.
            // Otherwise, just keep the original character.
            // This part might override multi-char emojis if not careful,
            // but for this simple cipher it's acceptable.
            finalEmojiString += emojiMap[char] || char;
        }
        return finalEmojiString;
    };

    // This function runs every time you type something in the text box.
    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        const newText = event.target.value; // Get what you typed
        setInputText(newText); // Update the variable that stores your text
        setTranslatedEmoji(translateToEmoji(newText)); // Translate it and update the emoji message!
    };

    // This is what our webpage will look like (HTML-like code inside JavaScript!)
    return (
        // Main container for the whole app
        // Centered content, min height for full screen, dark background
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-lime-200 p-4 sm:p-8">

            {/* Application Title */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-green-800 mb-4 sm:mb-6 text-center drop-shadow-md">
                Celo <span className="text-lime-700">Emoji</span> Translator
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-green-700 mb-8 sm:mb-10 text-center max-w-xl">
                Unleash your creativity! Type any message and watch it magically transform into a fun, Celo-themed emoji code.
            </p>

            {/* Main content card */}
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-green-300 transform transition-transform duration-300 hover:scale-102">

                {/* Input area */}
                <textarea
                    className="w-full p-4 sm:p-5 mb-6 text-lg sm:text-xl border-2 border-green-400 rounded-lg shadow-inner focus:outline-none focus:ring-4 focus:ring-green-500/50 transition-all duration-300 resize-y placeholder-gray-400 font-mono"
                    placeholder="Type your message here..."
                    value={inputText}
                    onChange={handleInputChange} // When text changes, run handleInputChange
                    rows={6} // Increased rows for more visible input area
                ></textarea>

                {/* Translated Emoji display area */}
                <div className="w-full p-6 sm:p-7 bg-green-50 border-2 border-green-500 rounded-lg shadow-inner min-h-[120px] sm:min-h-[150px] flex items-center justify-center text-4xl sm:text-5xl font-bold text-green-800 break-words whitespace-pre-wrap overflow-hidden leading-tight text-center relative">
                    {/* Conditional display for placeholder text */}
                    {translatedEmoji ? translatedEmoji : <span className="text-gray-400 text-xl sm:text-2xl font-normal">Your emoji message will appear here...</span>}
                    {/* Small tag at bottom right */}
                    <span className="absolute bottom-2 right-3 text-gray-300 text-sm italic">Coded with fun!</span>
                </div>

                {/* Copy button */}
                <button
                    onClick={() => {
                        // This copies the emoji text to your clipboard!
                        if (translatedEmoji) {
                            // document.execCommand('copy') is used because navigator.clipboard.writeText
                            // might not work directly inside some environments like iframes.
                            const tempInput = document.createElement('textarea');
                            tempInput.value = translatedEmoji;
                            document.body.appendChild(tempInput);
                            tempInput.select();
                            document.execCommand('copy');
                            document.body.removeChild(tempInput);
                            // Custom message box instead of alert for better UX
                            const messageBox = document.createElement('div');
                            messageBox.textContent = 'Emoji message copied!';
                            messageBox.className = 'fixed bottom-5 left-1/2 -translate-x-1/2 bg-green-600 text-white px-5 py-3 rounded-full shadow-lg text-lg animate-fade-in-out z-50';
                            document.body.appendChild(messageBox);
                            setTimeout(() => {
                                messageBox.remove();
                            }, 2000); // Remove message after 2 seconds
                        }
                    }}
                    className="mt-8 w-full bg-lime-600 hover:bg-lime-700 text-white font-bold py-3 sm:py-4 px-6 rounded-full shadow-lg transition-all duration-300 text-xl sm:text-2xl transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-lime-500/50"
                >
                    ✨ Copy Emoji Message ✨
                </button>
            </div>

            {/* Footer / Credit */}
            <p className="text-sm text-gray-600 mt-12 text-center">
                Built with 💚 for Celo MiniPay. Happy translating!
            </p>
        </div>
    );
}

// Make our component available to be used as the default page
export default EmojiTranslatorApp;

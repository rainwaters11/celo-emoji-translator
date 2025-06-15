// This special line tells React that this component should run in the 'client' (browser) environment.
"use client";

// We need React to build our interactive webpage parts.
import React, { useState, useEffect } from 'react'; // Added useEffect for dark mode persistence

// This is the main part of our dApp, like the central brain.
function EmojiTranslatorApp() {
    // STATE VARIABLES: These are special "variables" for React that remember things.
    const [inputText, setInputText] = useState(''); // Holds what you type
    const [translatedEmoji, setTranslatedEmoji] = useState(''); // Holds our emoji message
    const [isDarkMode, setIsDarkMode] = useState(false); // Controls the dark mode feature
    const [showTipInfo, setShowTipInfo] = useState(false); // Controls visibility of tip information
    const [showKeyInfo, setShowKeyInfo] = useState(false); // Controls visibility of the emoji key information

    // PREDEFINED CELO TIP ADDRESS (Replace with your actual Celo address if you deploy this!)
    const celoTipAddress = "0xYourCeloAddressGoesHere"; // IMPORTANT: Replace with a real Celo address (e.g., from Valora)

    // EMOJI MAP: Our secret codebook for translating letters and words to emojis!
    // Added more mappings for a richer translation.
    const emojiMap = {
        'a': '🌳', 'b': '💰', 'c': '🌟', 'd': '📱', 'e': '💚',
        'f': '🍃', 'g': '✨', 'h': '🌱', 'i': '💡', 'j': '🔗',
        'k': '💎', 'l': '🚀', 'm': '🌎', 'n': '🌈', 'o': '💡',
        'p': '⚡', 'q': '🔑', 'r': '🔄', 's': '✨', 't': '⏱️',
        'u': '🤝', 'v': '📈', 'w': '🌐', 'x': '🛑', 'y': '✅',
        'z': '💡',
        '0': '0️⃣', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣', '4': '4️⃣',
        '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣',
        '!': '❗️', '?': '❓', '.': '▪️', ',': '▪️', ' ': '〰️', // Space gets a wave
        // Common Celo words (longer words get special treatment!)
        'celo': '💚🌳💰🌟',
        'minipay': '📱💸✨',
        'hello': '👋🌎',
        'world': '🌍🌐',
        'blockchain': '🔗⛓️',
        'money': '💰💸',
        'coin': '🪙✨',
        'decentralized': '🌐🔓',
        'mobile': '📱📶',
        'finance': '💹💸',
        'web3': '🌐🧠',
        'dapp': '✨📱',
        'developer': '💻💡',
        'build': '🏗️🚀',
        'community': '🤝🌈',
        'good': '👍🌟',
        'great': '🤩💯',
        'awesome': '✨🚀',
        'fun': '😄🎉',
        'love': '❤️‍🔥',
        'peace': '✌️🕊️',
        'happy': '😊🌞',
        'cool': '😎🧊',
        'data': '📊💾',
        'annotate': '🖍️👁️',
        'ai': '🤖🧠',
        'vehicle': '🚗💨',
        'autonomous': '🤖⚙️',
        'drive': '🛣️🚗',
        'rules': '📜🚦',
        'traffic': '🚦🚘',
        'engineer': '⚙️🔬',
        'tbilisi': '🇬🇪✨', // Georgia flag + sparkle
    };

    // FUNCTION: This function does the actual translating!
    const translateToEmoji = (text) => {
        let result = text.toLowerCase(); // Convert everything to lowercase first

        // OPTIMIZATION: Handle multi-character words (phrases) first to prevent partial matches.
        // We'll sort keys by length descending to prioritize longer matches.
        const sortedEmojiKeys = Object.keys(emojiMap).sort((a, b) => b.length - a.length);

        for (const word of sortedEmojiKeys) {
            // Only consider words longer than 1 character for this pass
            if (word.length > 1 && result.includes(word)) {
                // Replace ALL occurrences of the word with its emoji combo
                // Using a RegExp with 'g' flag for global replacement
                result = result.replace(new RegExp(word, 'g'), emojiMap[word]);
            }
        }

        // Now, go through the remaining text character by character for single letters/symbols
        let finalEmojiString = '';
        for (let i = 0; i < result.length; i++) {
            const char = result[i];
            // If we find the character in our emojiMap, use its emoji.
            // Otherwise, just keep the original character.
            finalEmojiString += emojiMap[char] || char;
        }
        return finalEmojiString;
    };

    // EVENT HANDLER: Runs every time you type something in the text box.
    const handleInputChange = (event) => {
        const newText = event.target.value; // Get what you typed
        setInputText(newText); // Update the variable that stores your text
        setTranslatedEmoji(translateToEmoji(newText)); // Translate it and update the emoji message!
    };

    // EVENT HANDLER: Clears both input and output text areas.
    const handleClearInput = () => {
        setInputText('');
        setTranslatedEmoji('');
    };

    // EVENT HANDLER: Toggles Dark Mode.
    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
        // Save user preference to local storage
        localStorage.setItem('darkMode', JSON.stringify(!isDarkMode));
    };

    // EFFECT: Load dark mode preference from local storage when the component mounts.
    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode !== null) {
            setIsDarkMode(JSON.parse(savedMode));
        }
    }, []); // Empty dependency array means this runs only once after initial render

    // FUNCTION: Shows a custom, temporary message box instead of `alert()`.
    const showToast = (message) => {
        const messageBox = document.createElement('div');
        messageBox.textContent = message;
        // Apply Tailwind classes for styling and animation
        messageBox.className = `
            fixed bottom-5 left-1/2 -translate-x-1/2
            bg-green-600 text-white px-5 py-3 rounded-full shadow-lg text-lg
            opacity-0 transition-opacity duration-300 ease-out z-50
            ${isDarkMode ? 'bg-gray-700' : 'bg-green-600'}
        `;
        document.body.appendChild(messageBox);

        // Animate in
        setTimeout(() => {
            messageBox.style.opacity = '1';
        }, 10); // Small delay to ensure transition applies

        // Animate out and remove
        setTimeout(() => {
            messageBox.style.opacity = '0';
            setTimeout(() => {
                messageBox.remove();
            }, 300); // Wait for fade-out transition to complete
        }, 2000); // Display for 2 seconds

        // To achieve a more complex fade-in/fade-out animation with keyframes,
        // you would add the following to your `globals.css` file:
        /*
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, 20px); }
          10% { opacity: 1; transform: translate(-50%, 0); }
          90% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -20px); }
        }
        .animate-fade-in-out {
          animation: fadeInOut 2.3s ease-in-out forwards; // Adjust duration as needed
        }
        */
        // And then add `animate-fade-in-out` class to `messageBox.className` string.
    };

    // DYNAMIC TAILWIND CLASSES based on dark mode.
    const containerClasses = `
        flex flex-col items-center justify-center min-h-screen p-4 sm:p-8
        transition-colors duration-500
        ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-green-100 to-lime-200 text-gray-800'}
    `;

    const cardClasses = `
        w-full max-w-xl rounded-2xl shadow-xl p-6 sm:p-8 border
        transform transition-transform duration-300 hover:scale-102
        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-green-300'}
    `;

    const headerClasses = `
        text-4xl sm:text-5xl font-extrabold mb-4 sm:mb-6 text-center drop-shadow-md
        ${isDarkMode ? 'text-lime-400' : 'text-green-800'}
    `;
    const headerSpanClasses = `
        ${isDarkMode ? 'text-green-300' : 'text-lime-700'}
    `;

    const paragraphClasses = `
        text-lg sm:text-xl mb-8 sm:mb-10 text-center max-w-xl
        ${isDarkMode ? 'text-gray-300' : 'text-green-700'}
    `;

    const textareaClasses = `
        w-full p-4 sm:p-5 mb-6 text-lg sm:text-xl border-2 rounded-lg shadow-inner focus:outline-none focus:ring-4 transition-all duration-300 resize-y font-mono
        ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:ring-lime-500/50 placeholder-gray-500' : 'bg-white text-gray-800 border-green-400 focus:ring-green-500/50 placeholder-gray-400'}
    `;

    const displayClasses = `
        w-full p-6 sm:p-7 border-2 rounded-lg shadow-inner min-h-[120px] sm:min-h-[150px] flex items-center justify-center text-4xl sm:text-5xl font-bold break-words whitespace-pre-wrap overflow-hidden leading-tight text-center relative
        ${isDarkMode ? 'bg-gray-700 border-gray-600 text-lime-300' : 'bg-green-50 border-green-500 text-green-800'}
    `;

    const copyButtonClasses = `
        mt-8 w-full font-bold py-3 sm:py-4 px-6 rounded-full shadow-lg transition-all duration-300 text-xl sm:text-2xl transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4
        ${isDarkMode ? 'bg-lime-600 hover:bg-lime-700 text-white focus:ring-lime-500/50' : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500/50'}
    `;

    const utilityButtonClasses = `
        px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300
        ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}
    `;

    // Separate single characters from words for display clarity in the key
    const singleCharMap = Object.entries(emojiMap).filter(([key]) => key.length === 1);
    const wordMap = Object.entries(emojiMap).filter(([key]) => key.length > 1);


    // MAIN APP RENDER: This is what our webpage will look like
    return (
        <div className={containerClasses}>
            {/* Dark Mode Toggle Button */}
            <button
                onClick={toggleDarkMode}
                className={`
                    absolute top-4 right-4 p-3 rounded-full shadow-md text-xl
                    ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-yellow-400 text-gray-800'}
                    transition-all duration-300 hover:scale-110 active:scale-90 focus:outline-none focus:ring-2
                `}
                aria-label="Toggle Dark Mode"
            >
                {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* Application Title */}
            <h1 className={headerClasses}>
                Celo <span className={headerSpanClasses}>Emoji</span> Translator
            </h1>

            {/* Description */}
            <p className={paragraphClasses}>
                Unleash your creativity! Type any message and watch it magically transform into a fun, Celo-themed emoji code.
            </p>

            {/* Main content card */}
            <div className={cardClasses}>

                {/* Input area */}
                <div className="relative mb-6">
                    <textarea
                        className={textareaClasses}
                        placeholder="Type your message here..."
                        value={inputText}
                        onChange={handleInputChange}
                        rows="6"
                    ></textarea>
                    {/* Character Count for Input */}
                    <p className={`text-xs mt-1 text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {inputText.length} characters
                    </p>
                    {/* Clear Input Button */}
                    {inputText && ( // Only show if there's text
                        <button
                            onClick={handleClearInput}
                            className={`
                                absolute bottom-8 right-4 ${utilityButtonClasses}
                                ${isDarkMode ? 'border border-gray-500' : 'border border-gray-300'}
                            `}
                        >
                            Clear
                        </button>
                    )}
                </div>


                {/* Translated Emoji display area */}
                <div className={displayClasses}>
                    {/* Conditional display for placeholder text */}
                    {translatedEmoji ? translatedEmoji : <span className="text-xl sm:text-2xl font-normal text-gray-400">Your emoji message will appear here...</span>}
                    {/* Small tag at bottom right */}
                    <span className="absolute bottom-2 right-3 text-sm italic text-gray-300">Coded with fun!</span>
                </div>
                {/* Emoji Count for Output */}
                <p className={`text-xs mt-1 text-left ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {translatedEmoji.length} emojis
                </p>


                {/* Main Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    {/* Copy button */}
                    <button
                        onClick={() => {
                            if (translatedEmoji) {
                                const tempInput = document.createElement('textarea');
                                tempInput.value = translatedEmoji;
                                document.body.appendChild(tempInput);
                                tempInput.select();
                                document.execCommand('copy'); // Fallback for navigator.clipboard
                                document.body.removeChild(tempInput);
                                showToast('Emoji message copied!');
                            } else {
                                showToast('Nothing to copy!');
                            }
                        }}
                        className={copyButtonClasses}
                    >
                        ✨ Copy Emoji Message ✨
                    </button>

                    {/* Tip the Creator Button */}
                    <button
                        onClick={() => setShowTipInfo(prev => !prev)}
                        className={`
                            w-full font-bold py-3 sm:py-4 px-6 rounded-full shadow-lg transition-all duration-300 text-xl sm:text-2xl transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4
                            ${isDarkMode ? 'bg-green-700 hover:bg-green-800 text-white focus:ring-green-500/50' : 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500/50'}
                        `}
                    >
                        {showTipInfo ? 'Hide Tip Info' : '💚 Tip the Creator 💚'}
                    </button>
                </div>

                {/* Emoji Key Button */}
                <button
                    onClick={() => setShowKeyInfo(prev => !prev)}
                    className={`
                        mt-4 w-full font-bold py-3 sm:py-4 px-6 rounded-full shadow-lg transition-all duration-300 text-xl sm:text-2xl transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4
                        ${isDarkMode ? 'bg-blue-700 hover:bg-blue-800 text-white focus:ring-blue-500/50' : 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500/50'}
                    `}
                >
                    {showKeyInfo ? 'Hide Emoji Key' : '🔑 Show Emoji Key 🔑'}
                </button>


                {/* Tip Information Display */}
                {showTipInfo && (
                    <div className={`
                        mt-6 p-4 rounded-lg border-2 text-center
                        ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-yellow-50 border-yellow-300 text-yellow-800'}
                    `}>
                        <p className="font-semibold mb-2">Enjoying the app? Send some love to the creator!</p>
                        <p className="font-mono text-sm sm:text-base break-all p-2 rounded-md select-all
                            ${isDarkMode ? 'bg-gray-600 text-lime-300' : 'bg-yellow-100 text-yellow-900'}">
                            {celoTipAddress}
                        </p>
                        <button
                            onClick={() => {
                                // Copy tip address to clipboard
                                const tempInput = document.createElement('textarea');
                                tempInput.value = celoTipAddress;
                                document.body.appendChild(tempInput);
                                tempInput.select();
                                document.execCommand('copy');
                                document.body.removeChild(tempInput);
                                showToast('Celo Address Copied!');
                            }}
                            className={`mt-4 ${utilityButtonClasses}`}
                        >
                            Copy Address
                        </button>
                    </div>
                )}

                {/* Emoji Key Information Display */}
                {showKeyInfo && (
                    <div className={`
                        mt-6 p-4 rounded-lg border-2 text-center max-h-96 overflow-y-auto
                        ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-blue-50 border-blue-300 text-blue-800'}
                    `}>
                        <h3 className="font-bold text-xl mb-3">Emoji Translation Key</h3>

                        <h4 className="font-semibold text-lg mt-4 mb-2">Alphabet & Numbers</h4>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 text-sm md:text-base">
                            {singleCharMap.map(([key, value]) => (
                                <div key={key} className={`p-1 rounded flex items-center justify-center gap-1
                                    ${isDarkMode ? 'bg-gray-600' : 'bg-blue-100'}`}>
                                    <span className="font-mono font-bold">{key}</span> : <span>{value}</span>
                                </div>
                            ))}
                        </div>

                        <h4 className="font-semibold text-lg mt-6 mb-2">Common Words & Phrases</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm md:text-base">
                            {wordMap.map(([key, value]) => (
                                <div key={key} className={`p-1 rounded flex items-center justify-center gap-1 text-center flex-col
                                    ${isDarkMode ? 'bg-gray-600' : 'bg-blue-100'}`}>
                                    <span className="font-mono font-bold">{key}</span> : <span>{value}</span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 text-sm italic">
                            (Special characters like punctuation and spaces also have emojis!)
                        </p>
                    </div>
                )}


            </div> {/* End of Main content card */}

            {/* Footer / Credit */}
            <p className={`text-sm mt-12 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Built with 💚 for Celo MiniPay. Happy translating!
            </p>
        </div>
    );
}

export default EmojiTranslatorApp;

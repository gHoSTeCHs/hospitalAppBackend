import { useState } from 'react';

const CopyInput = ({ value }: { value: number }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(String(value)).then();
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <div className="relative w-full max-w-md">
            <div className="flex items-center">
                <label hidden className="mr-2 text-gray-700" htmlFor="address">
                    Wallet Address:
                </label>
                <input
                    type="text"
                    title="Wallet Address"
                    value={value}
                    name="address"
                    disabled
                    className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 py-2 pr-10 pl-3 text-gray-700 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                    onClick={handleCopy}
                    className="group absolute right-2 transition-all duration-300 hover:scale-110"
                    aria-label="Copy to clipboard"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`text-gray-500 group-hover:text-blue-600 ${copied ? 'text-green-500' : ''} `}
                    >
                        {copied ? (
                            <>
                                <path d="M12 22l10-10-10-10" />
                                <path d="M19 7l3-3" />
                            </>
                        ) : (
                            <>
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </>
                        )}
                    </svg>
                </button>
            </div>
            {copied && (
                <div className="absolute top-full mt-2 animate-bounce rounded-md bg-green-100 px-3 py-1 text-sm text-green-800 shadow-lg">
                    Copied to clipboard!
                </div>
            )}
        </div>
    );
};

export default CopyInput;

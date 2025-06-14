import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { ContentCopy as ContentCopyIcon, CheckCircleOutline as CheckCircleIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';

interface CopyButtonProps {
    text?: string;
    size?: 'small' | 'medium' | 'large';
    sx?: object;
}

export default function CopyButton({ text, size = 'small', sx }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!text) return;
        
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success('Copied to clipboard');
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
            toast.error('Failed to copy text');
        }
    };

    return (
        <Tooltip title="Copy">
            <IconButton
                size={size}
                onClick={handleCopy}
                sx={{
                    p: 0.5,
                    ...sx
                }}
            >
                {copied ? (
                    <CheckCircleIcon sx={{ 
                        fontSize: size === 'small' ? '1.1rem' : '1.25rem',
                        color: 'success.main',
                    }} />
                ) : (
                    <ContentCopyIcon sx={{ 
                        fontSize: size === 'small' ? '1.1rem' : '1.25rem',
                        color: 'text.secondary',
                    }} />
                )}
            </IconButton>
        </Tooltip>
    );
}

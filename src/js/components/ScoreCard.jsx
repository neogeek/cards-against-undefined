import React from 'react';

import { StyledScoreIcon, StyledScoreText } from './ScoreCard.styles';

const ScoreCard = ({ children }) => {
    return (
        <StyledScoreIcon>
            <svg width="60" height="63" xmlns="http://www.w3.org/2000/svg">
                <g
                    transform="translate(-2 -3)"
                    fill="#000"
                    stroke="#FFF"
                    strokeWidth="2"
                    fillRule="evenodd"
                >
                    <rect
                        transform="rotate(-20 29.5 33)"
                        x="9"
                        y="7"
                        width="41"
                        height="52"
                        rx="10"
                    />
                    <rect
                        transform="rotate(-10 35.016 35.402)"
                        x="14.516"
                        y="9.402"
                        width="41"
                        height="52"
                        rx="10"
                    />
                    <rect
                        x="19.531"
                        y="12.725"
                        width="41"
                        height="52"
                        rx="10"
                    />
                </g>
            </svg>
            <StyledScoreText>{children}</StyledScoreText>
        </StyledScoreIcon>
    );
};

export { ScoreCard };

import React from 'react';

import {
    StyledCard,
    StyledCardHeader,
    StyledCardIndex,
    StyledCardText,
    StyledCardDescription,
    StyledCardFooter,
    StyledCardFooterLogo
} from './Card.styles';

const types = {
    black: {
        backgroundColor: '#000',
        textColor: '#fff'
    },
    white: {
        backgroundColor: '#fff',
        textColor: '#000'
    }
};

const CardFront = ({
    text = 'undefined',
    description = '',
    type = 'white',
    onClick,
    disabled = false,
    badgeNumber
}) => {
    return (
        <StyledCard
            backgroundColor={types[type].backgroundColor}
            textColor={types[type].textColor}
            onClick={!disabled ? onClick : null}
        >
            {badgeNumber && <StyledCardIndex>{badgeNumber}</StyledCardIndex>}
            <StyledCardText
                dangerouslySetInnerHTML={{
                    __html: text.replace(/_/g, '__________')
                }}
            ></StyledCardText>
            <StyledCardDescription>{description}</StyledCardDescription>
            <StyledCardFooter>
                <StyledCardFooterLogo src="/images/logo.svg" width="25" />
                Cards Against Undefined
            </StyledCardFooter>
        </StyledCard>
    );
};

const CardBack = ({ type = 'white' }) => {
    return (
        <StyledCard
            backgroundColor={types[type].backgroundColor}
            textColor={types[type].textColor}
        >
            <StyledCardHeader>Cards Against Undefined</StyledCardHeader>
        </StyledCard>
    );
};

export { CardFront, CardBack };

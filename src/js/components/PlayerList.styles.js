import styled from 'styled-components';

export const StyledPlayerList = styled.ul`
    width: 100%;
`;
export const StyledPlayerListItem = styled.li`
    list-style: none;
    min-height: 1rem;
    padding: 0.25rem 0;
    padding-left: calc(24px + 0.75rem);
    background-repeat: no-repeat;
    background-position: left center;
    &.ready {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M17 11l2 2 4-4"/></svg>');
    }
    &:not(.ready) {
        color: #aaa;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="%23D33920" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M18 8l5 5M23 8l-5 5"/></svg>');
    }
`;

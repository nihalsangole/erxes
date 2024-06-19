import styled from 'styled-components';

const PeriodLocksTableWrapper = styled.div`
  td {
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  tr:nth-child(even) {
    background-color: #fff;
  }
`;

export { PeriodLocksTableWrapper };

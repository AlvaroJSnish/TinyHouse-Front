import { gql } from 'apollo-boost';

export const LOG_Out = gql`
  mutation LogOut {
    logOut {
      id
      token
      avatar
      hasWallet
      didRequest
    }
  }
`;

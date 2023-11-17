export interface UserDetails {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    enabled: boolean;
    username: string;
    authorities: any[]; // You might want to define a proper model for authorities
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
    accountNonLocked: boolean;
    locked: boolean;
  }
  
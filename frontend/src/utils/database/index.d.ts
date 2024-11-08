import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';
export const connectorConfig: ConnectorConfig;

export type TimestampString = string;

export type UUIDString = string;

export type Int64String = string;

export type DateString = string;



export interface Application_Key {
  userId: UUIDString;
  gigId: UUIDString;
  __typename?: 'Application_Key';
}

export interface Category_Key {
  id: UUIDString;
  __typename?: 'Category_Key';
}

export interface CreateCategoryData {
  category_insert: Category_Key;
}

export interface CreateCategoryVariables {
  categoryName: string;
  gigId?: UUIDString | null;
  userId?: UUIDString | null;
}

export interface CreateGigData {
  Gig_insert: Gig_Key;
}

export interface CreateGigVariables {
  userId: UUIDString;
  title: string;
  description: string;
  price?: number | null;
  status: string;
}

export interface CreateLanguageData {
  Language_insert: Language_Key;
}

export interface CreateLanguageVariables {
  languageName: string;
  userId: UUIDString;
}

export interface CreateMessageData {
  message_insert: Message_Key;
}

export interface CreateMessageVariables {
  senderId: UUIDString;
  receiverId: UUIDString;
  textContent: string;
}

export interface CreateRatingData {
  Rating_insert: Rating_Key;
}

export interface CreateRatingVariables {
  userId: UUIDString;
  gigId: UUIDString;
  ratingValue: number;
}

export interface CreateTransactionData {
  Transaction_insert: Transaction_Key;
}

export interface CreateTransactionVariables {
  senderId: UUIDString;
  receiverId: UUIDString;
  gigId: UUIDString;
  amount: number;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  username: string;
  name: string;
  bio: string;
}

export interface CreatingApplicatiponData {
  Application_insert: Application_Key;
}

export interface CreatingApplicatiponVariables {
  userId: UUIDString;
  gigId: UUIDString;
  status: string;
}

export interface DeleteCategoryData {
  category_delete?: Category_Key | null;
}

export interface DeleteCategoryVariables {
  categoryId: UUIDString;
}

export interface DeleteGigData {
  Gig_delete?: Gig_Key | null;
}

export interface DeleteGigVariables {
  gigId: UUIDString;
}

export interface DeleteMessageData {
  message_delete?: Message_Key | null;
}

export interface DeleteMessageVariables {
  messageId: UUIDString;
}

export interface DeleteRatingData {
  Rating_delete?: Rating_Key | null;
}

export interface DeleteRatingVariables {
  ratingId: UUIDString;
}

export interface DeleteTransactionData {
  Transaction_delete?: Transaction_Key | null;
}

export interface DeleteTransactionVariables {
  transactionId: UUIDString;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface DeleteUserVariables {
  userId: UUIDString;
}

export interface Gig_Key {
  id: UUIDString;
  __typename?: 'Gig_Key';
}

export interface InsertManyUsersData {
  user_insertMany: User_Key[];
}

export interface Language_Key {
  id: UUIDString;
  __typename?: 'Language_Key';
}

export interface ListGigsData {
  Gigs: ({
    id: UUIDString;
    title: string;
    description: string;
    price?: number | null;
    status: string;
    createdAt?: TimestampString | null;
    updatedAt?: TimestampString | null;
    user?: {
      id: UUIDString;
      username: string;
    } & User_Key;
      rating: ({
        id: UUIDString;
        ratingValue?: number | null;
      } & Rating_Key)[];
  } & Gig_Key)[];
}

export interface ListLanguagesData {
  Languages: ({
    languageName: string;
    id: UUIDString;
    userId: UUIDString;
  } & Language_Key)[];
}

export interface ListUsersData {
  users: ({
    id: UUIDString;
    username: string;
    name: string;
    bio: string;
  } & User_Key)[];
}

export interface Message_Key {
  id: UUIDString;
  __typename?: 'Message_Key';
}

export interface Rating_Key {
  id: UUIDString;
  __typename?: 'Rating_Key';
}

export interface Transaction_Key {
  id: UUIDString;
  __typename?: 'Transaction_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}



/* Allow users to create refs without passing in DataConnect */
export function createUserRef(vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
/* Allow users to pass in custom DataConnect instances */
export function createUserRef(dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData,CreateUserVariables>;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData,CreateUserVariables>;


/* Allow users to create refs without passing in DataConnect */
export function insertManyUsersRef(): MutationRef<InsertManyUsersData, undefined>;/* Allow users to pass in custom DataConnect instances */
export function insertManyUsersRef(dc: DataConnect): MutationRef<InsertManyUsersData,undefined>;

export function insertManyUsers(): MutationPromise<InsertManyUsersData, undefined>;
export function insertManyUsers(dc: DataConnect): MutationPromise<InsertManyUsersData,undefined>;


/* Allow users to create refs without passing in DataConnect */
export function deleteUserRef(vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
/* Allow users to pass in custom DataConnect instances */
export function deleteUserRef(dc: DataConnect, vars: DeleteUserVariables): MutationRef<DeleteUserData,DeleteUserVariables>;

export function deleteUser(vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;
export function deleteUser(dc: DataConnect, vars: DeleteUserVariables): MutationPromise<DeleteUserData,DeleteUserVariables>;


/* Allow users to create refs without passing in DataConnect */
export function createLanguageRef(vars: CreateLanguageVariables): MutationRef<CreateLanguageData, CreateLanguageVariables>;
/* Allow users to pass in custom DataConnect instances */
export function createLanguageRef(dc: DataConnect, vars: CreateLanguageVariables): MutationRef<CreateLanguageData,CreateLanguageVariables>;

export function createLanguage(vars: CreateLanguageVariables): MutationPromise<CreateLanguageData, CreateLanguageVariables>;
export function createLanguage(dc: DataConnect, vars: CreateLanguageVariables): MutationPromise<CreateLanguageData,CreateLanguageVariables>;


/* Allow users to create refs without passing in DataConnect */
export function createGigRef(vars: CreateGigVariables): MutationRef<CreateGigData, CreateGigVariables>;
/* Allow users to pass in custom DataConnect instances */
export function createGigRef(dc: DataConnect, vars: CreateGigVariables): MutationRef<CreateGigData,CreateGigVariables>;

export function createGig(vars: CreateGigVariables): MutationPromise<CreateGigData, CreateGigVariables>;
export function createGig(dc: DataConnect, vars: CreateGigVariables): MutationPromise<CreateGigData,CreateGigVariables>;


/* Allow users to create refs without passing in DataConnect */
export function deleteGigRef(vars: DeleteGigVariables): MutationRef<DeleteGigData, DeleteGigVariables>;
/* Allow users to pass in custom DataConnect instances */
export function deleteGigRef(dc: DataConnect, vars: DeleteGigVariables): MutationRef<DeleteGigData,DeleteGigVariables>;

export function deleteGig(vars: DeleteGigVariables): MutationPromise<DeleteGigData, DeleteGigVariables>;
export function deleteGig(dc: DataConnect, vars: DeleteGigVariables): MutationPromise<DeleteGigData,DeleteGigVariables>;


/* Allow users to create refs without passing in DataConnect */
export function createTransactionRef(vars: CreateTransactionVariables): MutationRef<CreateTransactionData, CreateTransactionVariables>;
/* Allow users to pass in custom DataConnect instances */
export function createTransactionRef(dc: DataConnect, vars: CreateTransactionVariables): MutationRef<CreateTransactionData,CreateTransactionVariables>;

export function createTransaction(vars: CreateTransactionVariables): MutationPromise<CreateTransactionData, CreateTransactionVariables>;
export function createTransaction(dc: DataConnect, vars: CreateTransactionVariables): MutationPromise<CreateTransactionData,CreateTransactionVariables>;


/* Allow users to create refs without passing in DataConnect */
export function deleteTransactionRef(vars: DeleteTransactionVariables): MutationRef<DeleteTransactionData, DeleteTransactionVariables>;
/* Allow users to pass in custom DataConnect instances */
export function deleteTransactionRef(dc: DataConnect, vars: DeleteTransactionVariables): MutationRef<DeleteTransactionData,DeleteTransactionVariables>;

export function deleteTransaction(vars: DeleteTransactionVariables): MutationPromise<DeleteTransactionData, DeleteTransactionVariables>;
export function deleteTransaction(dc: DataConnect, vars: DeleteTransactionVariables): MutationPromise<DeleteTransactionData,DeleteTransactionVariables>;


/* Allow users to create refs without passing in DataConnect */
export function createMessageRef(vars: CreateMessageVariables): MutationRef<CreateMessageData, CreateMessageVariables>;
/* Allow users to pass in custom DataConnect instances */
export function createMessageRef(dc: DataConnect, vars: CreateMessageVariables): MutationRef<CreateMessageData,CreateMessageVariables>;

export function createMessage(vars: CreateMessageVariables): MutationPromise<CreateMessageData, CreateMessageVariables>;
export function createMessage(dc: DataConnect, vars: CreateMessageVariables): MutationPromise<CreateMessageData,CreateMessageVariables>;


/* Allow users to create refs without passing in DataConnect */
export function deleteMessageRef(vars: DeleteMessageVariables): MutationRef<DeleteMessageData, DeleteMessageVariables>;
/* Allow users to pass in custom DataConnect instances */
export function deleteMessageRef(dc: DataConnect, vars: DeleteMessageVariables): MutationRef<DeleteMessageData,DeleteMessageVariables>;

export function deleteMessage(vars: DeleteMessageVariables): MutationPromise<DeleteMessageData, DeleteMessageVariables>;
export function deleteMessage(dc: DataConnect, vars: DeleteMessageVariables): MutationPromise<DeleteMessageData,DeleteMessageVariables>;


/* Allow users to create refs without passing in DataConnect */
export function createCategoryRef(vars: CreateCategoryVariables): MutationRef<CreateCategoryData, CreateCategoryVariables>;
/* Allow users to pass in custom DataConnect instances */
export function createCategoryRef(dc: DataConnect, vars: CreateCategoryVariables): MutationRef<CreateCategoryData,CreateCategoryVariables>;

export function createCategory(vars: CreateCategoryVariables): MutationPromise<CreateCategoryData, CreateCategoryVariables>;
export function createCategory(dc: DataConnect, vars: CreateCategoryVariables): MutationPromise<CreateCategoryData,CreateCategoryVariables>;


/* Allow users to create refs without passing in DataConnect */
export function deleteCategoryRef(vars: DeleteCategoryVariables): MutationRef<DeleteCategoryData, DeleteCategoryVariables>;
/* Allow users to pass in custom DataConnect instances */
export function deleteCategoryRef(dc: DataConnect, vars: DeleteCategoryVariables): MutationRef<DeleteCategoryData,DeleteCategoryVariables>;

export function deleteCategory(vars: DeleteCategoryVariables): MutationPromise<DeleteCategoryData, DeleteCategoryVariables>;
export function deleteCategory(dc: DataConnect, vars: DeleteCategoryVariables): MutationPromise<DeleteCategoryData,DeleteCategoryVariables>;


/* Allow users to create refs without passing in DataConnect */
export function createRatingRef(vars: CreateRatingVariables): MutationRef<CreateRatingData, CreateRatingVariables>;
/* Allow users to pass in custom DataConnect instances */
export function createRatingRef(dc: DataConnect, vars: CreateRatingVariables): MutationRef<CreateRatingData,CreateRatingVariables>;

export function createRating(vars: CreateRatingVariables): MutationPromise<CreateRatingData, CreateRatingVariables>;
export function createRating(dc: DataConnect, vars: CreateRatingVariables): MutationPromise<CreateRatingData,CreateRatingVariables>;


/* Allow users to create refs without passing in DataConnect */
export function deleteRatingRef(vars: DeleteRatingVariables): MutationRef<DeleteRatingData, DeleteRatingVariables>;
/* Allow users to pass in custom DataConnect instances */
export function deleteRatingRef(dc: DataConnect, vars: DeleteRatingVariables): MutationRef<DeleteRatingData,DeleteRatingVariables>;

export function deleteRating(vars: DeleteRatingVariables): MutationPromise<DeleteRatingData, DeleteRatingVariables>;
export function deleteRating(dc: DataConnect, vars: DeleteRatingVariables): MutationPromise<DeleteRatingData,DeleteRatingVariables>;


/* Allow users to create refs without passing in DataConnect */
export function creatingApplicatiponRef(vars: CreatingApplicatiponVariables): MutationRef<CreatingApplicatiponData, CreatingApplicatiponVariables>;
/* Allow users to pass in custom DataConnect instances */
export function creatingApplicatiponRef(dc: DataConnect, vars: CreatingApplicatiponVariables): MutationRef<CreatingApplicatiponData,CreatingApplicatiponVariables>;

export function creatingApplicatipon(vars: CreatingApplicatiponVariables): MutationPromise<CreatingApplicatiponData, CreatingApplicatiponVariables>;
export function creatingApplicatipon(dc: DataConnect, vars: CreatingApplicatiponVariables): MutationPromise<CreatingApplicatiponData,CreatingApplicatiponVariables>;


/* Allow users to create refs without passing in DataConnect */
export function listUsersRef(): QueryRef<ListUsersData, undefined>;/* Allow users to pass in custom DataConnect instances */
export function listUsersRef(dc: DataConnect): QueryRef<ListUsersData,undefined>;

export function listUsers(): QueryPromise<ListUsersData, undefined>;
export function listUsers(dc: DataConnect): QueryPromise<ListUsersData,undefined>;


/* Allow users to create refs without passing in DataConnect */
export function listLanguagesRef(): QueryRef<ListLanguagesData, undefined>;/* Allow users to pass in custom DataConnect instances */
export function listLanguagesRef(dc: DataConnect): QueryRef<ListLanguagesData,undefined>;

export function listLanguages(): QueryPromise<ListLanguagesData, undefined>;
export function listLanguages(dc: DataConnect): QueryPromise<ListLanguagesData,undefined>;


/* Allow users to create refs without passing in DataConnect */
export function listGigsRef(): QueryRef<ListGigsData, undefined>;/* Allow users to pass in custom DataConnect instances */
export function listGigsRef(dc: DataConnect): QueryRef<ListGigsData,undefined>;

export function listGigs(): QueryPromise<ListGigsData, undefined>;
export function listGigs(dc: DataConnect): QueryPromise<ListGigsData,undefined>;



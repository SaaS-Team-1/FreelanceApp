import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';
export const connectorConfig: ConnectorConfig;

export type TimestampString = string;

export type UUIDString = string;

export type Int64String = string;

export type DateString = string;



export interface AddReviewData {
  review_upsert: Review_Key;
}

export interface AddReviewVariables {
  movieId: UUIDString;
  rating: number;
  reviewText: string;
}

export interface CreateMovieData {
  movie_insert: Movie_Key;
}

export interface CreateMovieVariables {
  title: string;
  genre: string;
  imageUrl: string;
}

export interface DeleteReviewData {
  review_delete?: Review_Key | null;
}

export interface DeleteReviewVariables {
  movieId: UUIDString;
}

export interface GetMovieByIdData {
  movie?: {
    id: UUIDString;
    title: string;
    imageUrl: string;
    genre?: string | null;
    metadata?: {
      rating?: number | null;
      releaseYear?: number | null;
      description?: string | null;
    };
      reviews: ({
        id: UUIDString;
        reviewText?: string | null;
        reviewDate: DateString;
        rating?: number | null;
        user: {
          id: string;
          username: string;
        } & User_Key;
      })[];
  } & Movie_Key;
}

export interface GetMovieByIdVariables {
  id: UUIDString;
}

export interface ListMoviesData {
  movies: ({
    id: UUIDString;
    title: string;
    imageUrl: string;
    genre?: string | null;
  } & Movie_Key)[];
}

export interface ListUserReviewsData {
  user?: {
    id: string;
    username: string;
    reviews: ({
      id: UUIDString;
      rating?: number | null;
      reviewDate: DateString;
      reviewText?: string | null;
      movie: {
        id: UUIDString;
        title: string;
      } & Movie_Key;
    })[];
  } & User_Key;
}

export interface ListUsersData {
  users: ({
    id: string;
    username: string;
  } & User_Key)[];
}

export interface MovieMetadata_Key {
  id: UUIDString;
  __typename?: 'MovieMetadata_Key';
}

export interface Movie_Key {
  id: UUIDString;
  __typename?: 'Movie_Key';
}

export interface Review_Key {
  userId: string;
  movieId: UUIDString;
  __typename?: 'Review_Key';
}

export interface SearchMovieData {
  movies: ({
    id: UUIDString;
    title: string;
    genre?: string | null;
    imageUrl: string;
  } & Movie_Key)[];
}

export interface SearchMovieVariables {
  titleInput?: string | null;
  genre?: string | null;
}

export interface UpsertUserData {
  user_upsert: User_Key;
}

export interface UpsertUserVariables {
  username: string;
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}



/* Allow users to create refs without passing in DataConnect */
export function createMovieRef(vars: CreateMovieVariables): MutationRef<CreateMovieData, CreateMovieVariables>;
/* Allow users to pass in custom DataConnect instances */
export function createMovieRef(dc: DataConnect, vars: CreateMovieVariables): MutationRef<CreateMovieData,CreateMovieVariables>;

export function createMovie(vars: CreateMovieVariables): MutationPromise<CreateMovieData, CreateMovieVariables>;
export function createMovie(dc: DataConnect, vars: CreateMovieVariables): MutationPromise<CreateMovieData,CreateMovieVariables>;


/* Allow users to create refs without passing in DataConnect */
export function upsertUserRef(vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
/* Allow users to pass in custom DataConnect instances */
export function upsertUserRef(dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData,UpsertUserVariables>;

export function upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;
export function upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData,UpsertUserVariables>;


/* Allow users to create refs without passing in DataConnect */
export function addReviewRef(vars: AddReviewVariables): MutationRef<AddReviewData, AddReviewVariables>;
/* Allow users to pass in custom DataConnect instances */
export function addReviewRef(dc: DataConnect, vars: AddReviewVariables): MutationRef<AddReviewData,AddReviewVariables>;

export function addReview(vars: AddReviewVariables): MutationPromise<AddReviewData, AddReviewVariables>;
export function addReview(dc: DataConnect, vars: AddReviewVariables): MutationPromise<AddReviewData,AddReviewVariables>;


/* Allow users to create refs without passing in DataConnect */
export function deleteReviewRef(vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
/* Allow users to pass in custom DataConnect instances */
export function deleteReviewRef(dc: DataConnect, vars: DeleteReviewVariables): MutationRef<DeleteReviewData,DeleteReviewVariables>;

export function deleteReview(vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;
export function deleteReview(dc: DataConnect, vars: DeleteReviewVariables): MutationPromise<DeleteReviewData,DeleteReviewVariables>;


/* Allow users to create refs without passing in DataConnect */
export function listMoviesRef(): QueryRef<ListMoviesData, undefined>;/* Allow users to pass in custom DataConnect instances */
export function listMoviesRef(dc: DataConnect): QueryRef<ListMoviesData,undefined>;

export function listMovies(): QueryPromise<ListMoviesData, undefined>;
export function listMovies(dc: DataConnect): QueryPromise<ListMoviesData,undefined>;


/* Allow users to create refs without passing in DataConnect */
export function listUsersRef(): QueryRef<ListUsersData, undefined>;/* Allow users to pass in custom DataConnect instances */
export function listUsersRef(dc: DataConnect): QueryRef<ListUsersData,undefined>;

export function listUsers(): QueryPromise<ListUsersData, undefined>;
export function listUsers(dc: DataConnect): QueryPromise<ListUsersData,undefined>;


/* Allow users to create refs without passing in DataConnect */
export function listUserReviewsRef(): QueryRef<ListUserReviewsData, undefined>;/* Allow users to pass in custom DataConnect instances */
export function listUserReviewsRef(dc: DataConnect): QueryRef<ListUserReviewsData,undefined>;

export function listUserReviews(): QueryPromise<ListUserReviewsData, undefined>;
export function listUserReviews(dc: DataConnect): QueryPromise<ListUserReviewsData,undefined>;


/* Allow users to create refs without passing in DataConnect */
export function getMovieByIdRef(vars: GetMovieByIdVariables): QueryRef<GetMovieByIdData, GetMovieByIdVariables>;
/* Allow users to pass in custom DataConnect instances */
export function getMovieByIdRef(dc: DataConnect, vars: GetMovieByIdVariables): QueryRef<GetMovieByIdData,GetMovieByIdVariables>;

export function getMovieById(vars: GetMovieByIdVariables): QueryPromise<GetMovieByIdData, GetMovieByIdVariables>;
export function getMovieById(dc: DataConnect, vars: GetMovieByIdVariables): QueryPromise<GetMovieByIdData,GetMovieByIdVariables>;


/* Allow users to create refs without passing in DataConnect */
export function searchMovieRef(vars?: SearchMovieVariables): QueryRef<SearchMovieData, SearchMovieVariables>;
/* Allow users to pass in custom DataConnect instances */
export function searchMovieRef(dc: DataConnect, vars?: SearchMovieVariables): QueryRef<SearchMovieData,SearchMovieVariables>;

export function searchMovie(vars?: SearchMovieVariables): QueryPromise<SearchMovieData, SearchMovieVariables>;
export function searchMovie(dc: DataConnect, vars?: SearchMovieVariables): QueryPromise<SearchMovieData,SearchMovieVariables>;



export interface IMovie {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
    popularity: number;
}

export interface MovieApiResponse {
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

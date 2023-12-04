"use client";
import { GameModesType, MoviesListType, ErrorStates } from "constant";
import { createContext, useEffect, useReducer } from "react";
import { fetchData } from "hooks";

export interface GameStateType {
  currentDifficulty: number | null;
  currentIndex: number | null;
  currentMode: GameModesType | null;
  error: string | null;
  moviesCache: { [key: string]: boolean };
  moviesList: MoviesListType[];
  starsCount: number | null;
  startTime: number | null;
}

export const GameStoreActions = {
  RESET_STORE: "RESET_STORE",
  SET_CURRENT_DIFFICULTY: "SET_CURRENT_DIFFICULTY",
  SET_CURRENT_MODE: "SET_CURRENT_MODE",
  SET_ERROR: "SET_ERROR",
  SET_START_TIME: "SET_START_TIME",
  START_GAME: "START_GAME",
  UPDATE_MOVIES_LIST: "UPDATE_MOVIES_LIST",
  UPDATE_FAIL_ANSWER: "UPDATE_FAIL_ANSWER",
  UPDATE_PASS_ANSWER: "UPDATE_PASS_ANSWER",
} as const;

export interface GameStoreMethodsType {
  resetStore: Function;
  setCurrentDifficulty: Function;
  setCurrentMode: Function;
  setError: Function;
  setStartTime: Function;
  startGame: Function;
  updateMoviesList: Function;
  updateFailAnswer: Function;
  updatePassAnswer: Function;
}

export function useGameStore(): [GameStateType, GameStoreMethodsType] {
  const initialState: GameStateType = {
    currentDifficulty: null,
    currentIndex: null,
    currentMode: null,
    error: null,
    moviesCache: {},
    moviesList: [],
    starsCount: null,
    startTime: null,
  };

  const gameStoreReducer = function (state: GameStateType, action: any) {
    switch (action.type) {
      case GameStoreActions.RESET_STORE:
        return { ...initialState, moviesCache: state.moviesCache };
      case GameStoreActions.SET_CURRENT_DIFFICULTY:
        return {
          ...state,
          currentDifficulty: action.newDifficulty,
        };
      case GameStoreActions.SET_CURRENT_MODE:
        return {
          ...state,
          currentMode: action.newMode,
        };
      case GameStoreActions.SET_ERROR:
        return {
          ...state,
          error: action.newError,
        };
      case GameStoreActions.SET_START_TIME:
        state.startTime;
        return {
          ...state,
          startTime: action.newStartTime,
        };
      case GameStoreActions.START_GAME:
        if (state.moviesList.length === 0) {
          return {
            ...state,
            error: ErrorStates.END_OF_LIST,
          };
        }
        return { ...state, currentIndex: 0, starsCount: 0 };
      case GameStoreActions.UPDATE_MOVIES_LIST: {
        const newMoviesCache = { ...state.moviesCache };
        const newMoviesList: MoviesListType[] = [];
        action.newData.forEach((movie: MoviesListType) => {
          if (newMoviesCache[movie.english] == null) {
            newMoviesList.push(movie);
          }
        });
        if (state.moviesList.length === 0 && newMoviesList[0] != null) {
          newMoviesCache[newMoviesList[0]?.english] = true;
        }
        return {
          ...state,
          moviesCache: newMoviesCache,
          moviesList: [...state.moviesList, ...newMoviesList],
        };
      }
      case GameStoreActions.UPDATE_FAIL_ANSWER: {
        let newIndex = state.currentIndex! + 1;
        while (
          newIndex + 1 < state.moviesList.length &&
          state.moviesCache[state.moviesList[newIndex].english] != null
        ) {
          newIndex++;
        }
        if (newIndex + 1 >= state.moviesList.length) {
          return {
            ...state,
            error: ErrorStates.END_OF_LIST,
          };
        }
        return {
          ...state,
          currentIndex: newIndex,
          moviesCache: {
            ...state.moviesCache,
            [state.moviesList[newIndex].english]: true,
          },
        };
      }
      case GameStoreActions.UPDATE_PASS_ANSWER: {
        let newIndex = state.currentIndex! + 1;
        while (
          newIndex + 1 < state.moviesList.length &&
          state.moviesCache[state.moviesList[newIndex].english] != null
        ) {
          newIndex++;
        }
        if (newIndex + 1 >= state.moviesList.length) {
          return {
            ...state,
            error: ErrorStates.END_OF_LIST,
          };
        }
        return {
          ...state,
          currentIndex: newIndex,
          moviesCache: {
            ...state.moviesCache,
            [state.moviesList[newIndex].english]: true,
          },
          starsCount: state.starsCount! + 1,
        };
      }
      default:
        return state;
    }
  };

  const [gameState, dispatch] = useReducer(gameStoreReducer, initialState);

  const fetchMovies = async () => {
    let url =
      gameState?.currentMode?.endpoint + (gameState?.currentDifficulty || "2");
    const result = await fetchData(url);
    if (!result) {
      dispatch({
        type: GameStoreActions.SET_ERROR,
        newError: ErrorStates.BACKEND_FAIL,
      });
      return;
    }
    dispatch({
      type: GameStoreActions.UPDATE_MOVIES_LIST,
      newData: result,
    });
  };

  useEffect(() => {
    if (
      gameState.moviesList.length &&
      gameState.moviesList.length - gameState.currentIndex! < 5
    ) {
      fetchMovies();
    }
  }, [gameState.currentIndex]);

  return [
    gameState,
    {
      resetStore: function () {
        dispatch({
          type: GameStoreActions.RESET_STORE,
        });
      },
      setCurrentDifficulty: function (newDifficulty: number) {
        dispatch({
          type: GameStoreActions.SET_CURRENT_DIFFICULTY,
          newDifficulty,
        });
      },
      setCurrentMode: function (newMode: GameModesType) {
        dispatch({
          type: GameStoreActions.SET_CURRENT_MODE,
          newMode,
        });
      },
      setError: function (newError: string) {
        dispatch({
          type: GameStoreActions.SET_ERROR,
          newError,
        });
      },
      setStartTime: function (newStartTime: number) {
        dispatch({
          type: GameStoreActions.SET_START_TIME,
          newStartTime,
        });
      },
      startGame: function () {
        dispatch({
          type: GameStoreActions.START_GAME,
        });
      },
      updateMoviesList: function (newData: MoviesListType[]) {
        dispatch({
          type: GameStoreActions.UPDATE_MOVIES_LIST,
          newData,
        });
      },
      updateFailAnswer: function () {
        dispatch({
          type: GameStoreActions.UPDATE_FAIL_ANSWER,
        });
      },
      updatePassAnswer: function () {
        dispatch({
          type: GameStoreActions.UPDATE_PASS_ANSWER,
        });
      },
    },
  ];
}

export interface GameStoreContextType extends GameStateType {
  gameStoreMethods: GameStoreMethodsType;
}

export const GameStoreContext = createContext<GameStoreContextType | null>(
  null
);

import { useState, useEffect} from 'react'


const useMovies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/movie.json')
        .then(res => res.json())
        .then(data => {
            setMovies(data);
            setLoading(false);
        })
        .catch(err => {
            setError(err.message);
            setLoading(false);
        })
    }, []) // empty array, run once on mount

    return { movies, loading, error };
}

export default useMovies;
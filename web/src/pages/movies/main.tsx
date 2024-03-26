import React, { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { Tab } from 'rc-tabs/lib/interface';
import { Button, Input, Spin, Table, Tabs, Tag, message } from 'antd';
import { IEntity } from 'modules/movies/types';
import { Api, Mappers } from 'modules/movies';
import { Link, useNavigate, useParams } from 'react-router-dom';


interface MainProps {}

interface MainState {
  isLoading: boolean;
  genres: IEntity.Genre[];
  movies: IEntity.Movie[];
  selectedGenreId: string;
  pageSize: number;
  search: string;
}

const Main: React.FC<MainProps> = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<MainState>({
    isLoading: true,
    genres: [],
    movies: [],
    selectedGenreId: 'all',
    pageSize: 3,
    search: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genreResponse = await Api.Genre.List();
        const genres = (genreResponse.data || []).map(Mappers.Genre);

        genres.unshift({ id: 'all', name: 'All Genres' });

        const movieResponse = await Api.Movie.List();
        const movies = (movieResponse.data || []).map(Mappers.Movie);

        setState({ ...state, genres, movies, isLoading: false });
      } catch (err) {
        if (err instanceof AxiosError) {
          message.error(err.response?.data);
        }
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures that this effect runs once, similar to componentDidMount

  const { genres, movies, selectedGenreId, isLoading, pageSize, search } = state;


  if (isLoading) return <Spin />;

  const filteredMovies = selectedGenreId === 'all' ? movies : movies.filter(m => m.genre.id === selectedGenreId);
  const searchedMovies = filteredMovies.filter(
    m =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.genre.name.toLowerCase().includes(search.toLowerCase()) ||
      m.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container relative mx-auto pt-2">
      <Tabs
        animated
        activeKey={selectedGenreId}
        onChange={key => setState({ ...state, selectedGenreId: key, search: '' })}
        size="large"

        items={genres.map<Tab>(item => ({
          key: item.id,
          label: item.name,
          children: (
            <Table
              rowKey="id"
              loading={isLoading}
              dataSource={searchedMovies}
              bordered
              columns={[
                {
                  title: 'Title',
                  dataIndex: 'title',
                  render: (title, movie) => <Link to={movie.id}>{title}</Link>,
                  sorter: (a, b) => a.title.localeCompare(b.title)
                },
                {
                  title: 'Genre',
                  dataIndex: 'genre',
                  render: (genre: IEntity.Genre) => <Tag color="gold">{genre?.name}</Tag>
                },
                {
                  title: 'Owner',
                  dataIndex: 'owner'
                },
                {
                  title: 'Stock',
                  dataIndex: 'stock',
                  sorter: (a, b) => a.stock - b.stock
                },
                {
                  title: 'Rate',
                  dataIndex: 'rate',
                  sorter: (a, b) => a.rate - b.rate
                },
                {
                  title: 'Actions',
                  width: 100,
                  render: () => (
                    <div className="flex gap-2">
                      <Button type="primary" danger>
                        Delete
                      </Button>
                    </div>
                  )
                }
              ]}
              pagination={pageSize < filteredMovies.length && { pageSize }}
            />
          )
        }))}
      />
      <Input
        value={search}
        onChange={e => setState({ ...state, search: e.target.value })}
        allowClear
        placeholder="Search"
        className="absolute right-0 top-5 w-[400px]"
      />
    </div>
  );
};

export default Main;

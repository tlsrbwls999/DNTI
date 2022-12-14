import {
  Pagination,
  TextField,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PostRow from "../../1_molecules/PostRow";
import HotPostRow from "../../1_molecules/HotPostRow";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import axios from "axios";
import * as React from "react";
import { useEffect } from "react";
import useDidMountEffect from "../../utils/useDidmountEffect";

export default function PostMainComponent() {
  const [boardList, setBoardList] = React.useState([]);
  const [searchKey, setSearchKey] = React.useState("");
  const [searchCat, setSearchCat] = React.useState("제목");
  const [hotBoardList, setHotBoardList] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(10);
  const [fromOtherPage, setFromOtherPage] = React.useState(false);
  const [criteriaList, setCriteriaList] = React.useState([
    "제목",
    "내용",
    "아이디",
  ]);
  const guDong = useSelector((state) => state.guDong);
  const location = useLocation();

  function handleKeyword(e) {
    setSearchKey(e.target.value);
  }

  function handlePage(e, value) {
    setCurrentPage(value);
  }

  async function getHotBoard() {
    axios
      .get(
        `/board/hot?gu=${
          guDong.selectedGu === "전체" ? "" : guDong.selectedGu
        }&dong=${guDong.selectedDong === "전체" ? "" : guDong.selectedDong}`
      )
      .then(({ data }) => {
        console.log(data);
        setHotBoardList(data.response);
      });
  }

  function searchBoard() {
    let category = 0;
    if (searchCat === "내용") category = 1;
    else if (searchCat === "아이디") category = 2;
    console.log(searchCat);
    console.log(guDong);
    axios
      .get(
        `/board/search?gu=${
          guDong.selectedGu === "전체" ? "" : guDong.selectedGu
        }&dong=${
          guDong.selectedDong === "전체" ? "" : guDong.selectedDong
        }&category=${category}&keyword=${searchKey}&page=${
          currentPage - 1
        }&size=8`
      )
      .then((res) => {
        console.log(res);
        setTotalPage(res.data.response.totalPages);
        setBoardList(res.data.response.content);
        if (location.state.from !== 0) {
          location.state.from = 0;
        }
      });
  }

  useEffect(() => {
    console.log("location.state", location.state);
    if (location.state.from === 1) {
      console.log("location userId", location.state);
      setSearchKey(location.state.userId);
      setSearchCat("아이디");
      setFromOtherPage(true);
    }
  }, []);

  useEffect(() => {
    if (searchKey !== "" && searchCat === "아이디") {
      getHotBoard();
      searchBoard();
    }
  }, [fromOtherPage]);

  useEffect(() => {
    if (location.state.from === 1) return;
    getHotBoard();
    searchBoard();
  }, [guDong]);

  useDidMountEffect(() => {
    if (location.state.from === 1) return;
    searchBoard();
  }, [currentPage]);

  return (
    <div className="flex flex-col h-full w-4/5 items-center">
      <div className="flex flex-col h-4/5 w-full px-6">
        <div className="flex flex-row w-full justify-between items-center mb-5">
          <p className="font-bold text-3xl">자유 게시판</p>
        </div>
        <div className="flex flex-col h-full w-full items-center">
          <div className="flex flex-col h-[29rem] w-full dnticard">
            <div className="flex flex-col w-full">
              {hotBoardList.map((x) => {
                return (
                  <HotPostRow
                    key={x.boardId + "hot"}
                    Id={x.boardId}
                    title={x.title}
                    writer={x.nickname}
                    date={x.createdTime.substring(2, 10).replaceAll("-", ".")}
                    replies={x.commentCount}
                    views={x.hit}
                    likes={x.boardLike}
                    isCertified={x.isCertified}
                  />
                );
              })}
            </div>
            <div className="flex flex-col h-full w-full">
              {boardList && boardList.length > 0 ? (
                boardList.map((x) => {
                  return (
                    <PostRow
                      key={x.boardId}
                      Id={x.boardId}
                      title={x.title}
                      writer={x.nickname}
                      date={x.createdTime.substring(2, 10).replaceAll("-", ".")}
                      replies={x.commentCount}
                      views={x.hit}
                      likes={x.boardLike}
                      isCertified={x.isCertified}
                    />
                  );
                })
              ) : (
                <div className="flex flex-row h-full w-full justify-center items-center">
                  등록된 글이 없습니다.
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row justify-between items-center m-5 w-full">
            <div></div>
            <div className="flex flex-row justify-center items-start py-10">
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="criteria">카테고리</InputLabel>
                  <Select
                    labelId="criteria"
                    id="criteriaSelect"
                    value={searchCat}
                    label="카테고리"
                    onChange={(e) => setSearchCat(e.target.value)}
                    size="small"
                  >
                    {criteriaList.map((criteria) => {
                      return (
                        <MenuItem key={criteria} value={criteria}>
                          {criteria}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
              <div className="ml-3">
                <TextField
                  variant="outlined"
                  onChange={(e) => handleKeyword(e)}
                  size="small"
                  value={searchKey}
                />
                <IconButton
                  type="button"
                  sx={{ p: "10px" }}
                  aria-label="search"
                  onClick={() => searchBoard()}
                >
                  <SearchIcon />
                </IconButton>
              </div>
            </div>
            <div className="flex gap-4">
              <Link to="/board" state={{ from: 0 }}>
                <button className="graybtn-s">목록</button>
              </Link>
              <Link to="/board/postwrite" state={{ boardId: 0 }}>
                <button className="bluebtn-s">글쓰기</button>
              </Link>
            </div>
          </div>
          <Pagination
            count={totalPage}
            page={currentPage}
            variant="outlined"
            color="primary"
            onChange={handlePage}
          />
        </div>
      </div>
    </div>
  );
}

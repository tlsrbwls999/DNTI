package com.a601.backend.api.controller;

import com.a601.backend.api.domain.dto.common.ApiResult;
import com.a601.backend.api.domain.dto.request.FavoriteRequest;
import com.a601.backend.api.service.FavoriteServiceImpl;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Api(value = "즐겨찾기 API", tags = {"즐겨찾기"})
@RestController
@CrossOrigin("*")
@RequestMapping("/favorite")
@AllArgsConstructor
public class FavoriteController {

    private final FavoriteServiceImpl service;

    @ApiOperation(value = "즐겨찾기 조회", notes="조회")
    @GetMapping
    public ApiResult getFavorite(String userId) {
        return new ApiResult(200, service.getFavorite(userId));
    }

    @ApiOperation(value = "즐겨찾기 추가", notes="추가")
    @PostMapping
    public ApiResult addFavorite(@RequestBody FavoriteRequest favorite)  {
        service.addFavorite(favorite);
        return new ApiResult(200, favorite);
    }

    //favorite 수정
    @ApiOperation(value = "즐겨찾기 수정", notes="수정")
    @PatchMapping
    public ApiResult modifyFavorite(@RequestBody FavoriteRequest favorite) {
        service.modifyFavorite(favorite);
        return new ApiResult(200, favorite);
    }

    //favorite 삭제
    @ApiOperation(value = "즐겨찾기 삭제", notes="삭제")
    @DeleteMapping
    public ApiResult deleteFavorite(@RequestParam Integer favoriteId) {
        service.deleteFavorite(favoriteId);
        return new ApiResult(200, favoriteId);
    }
}

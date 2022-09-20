import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("getAll", () => {
    it("shuld return an array",() => {
      const result = service.getAll()
      expect(result).toBeInstanceOf(Array)
    })
  })

  describe("getOne", () => {
    it("should return a movie", () => {
      service.create({   //여기서 movie 생성
        title:"Test Movie",
        genres: ["test"],
        year: 2022
      })
      const movie = service.getOne(1)
      expect(movie).toBeDefined()
      expect(movie.id).toEqual(1)  // <= 없어도 무방
    })

    it("should throw 404 error", () => {
      try{
        service.getOne(999)
      }catch(e){
        expect(e).toBeInstanceOf(NotFoundException)
        expect(e.message).toEqual("Movie with ID 999 not found.") // <= 없어도 무방
      }
    })

  })

  describe("deleteOne", () => { //두가지 옵션 1.제대로 삭제 2.지우려는 movie 못 찾는거
    
    it("delete a movie", () => {
      service.create({   //여기서 movie 생성
        title:"Test Movie",
        genres: ["test"],
        year: 2022
      })
      const allMovies = service.getAll()
      service.deleteOne(1)
      const afterDelete = service.getAll()
      // expect(afterDelete.length).toEqual(allMovies.length - 1) 이것도 되고
      expect(afterDelete.length).toBeLessThan(allMovies.length)
    })
    it("should return a 404", () => {
      try{
        service.deleteOne(999)
      }catch(e){
        expect(e).toBeInstanceOf(NotFoundException)
      }
    })

  })

  describe("create", () => {

    it("should create a movie", () => {
      const beforeCreate = service.getAll().length
      service.create({
        title:"Test Movie",
        genres: ["test"],
        year: 2022
      })
      const afterCreate = service.getAll().length
      console.log(beforeCreate, afterCreate)
      expect(afterCreate).toBeGreaterThan(beforeCreate)
    })

  })

  describe("update", () => {

    it("shoud update a movie", () => {
        service.create({
        title:"Test Movie",
        genres: ["test"],
        year: 2022
      })
      service.update(1,{ title : "Updated Test" })
      const movie = service.getOne(1)
      expect(movie.title).toEqual("Updated Test")
    })

    it("should return a 404", () => {
      try{
        service.update(999,{ title : "Updated Test" })
      }catch(e){
        expect(e).toBeInstanceOf(NotFoundException)
      }
    })
  })

});

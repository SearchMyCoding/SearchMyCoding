import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCourseDto } from 'src/dto/CreateCourse.dto';
import { UpdateCourseDto } from 'src/dto/UpdateCourse.dto';
import { Course } from 'src/entities/course.entity';
import { Repository } from 'typeorm';
import { CourseService } from './course.service';

const mockCourseRepository = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  insert: jest.fn()
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('CoursesService', () => {
  let service: CourseService;
  let courseRepository: MockRepository<Course>;
  let mockedCourse : Course;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide : getRepositoryToken(Course),
          useValue : mockCourseRepository()
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
    courseRepository = module.get<MockRepository<Course>>(
      getRepositoryToken(Course),
    );

    mockedCourse = {
      id : 1,
      title : "웹의 이해",
      link : "https://www.example.link",
      img_link : "https://www.examplelink.link",
      rating : 0,
      price : 0
    };

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCourse',()=>{
    it('should find all course', async ()=>{
      courseRepository.find.mockResolvedValue([]);

      const result = await service.getAllCourse();
      expect(courseRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getCourseList',()=>{
    const mockedCourseList : Course[] = new Array<Course>(10);
    const mockedListNumber : number = 1;
    const mockedNumberOfCourseInList : number = 10;

    it(`should find ${mockedNumberOfCourseInList} course`, async ()=>{
      courseRepository.find.mockResolvedValue(mockedCourseList);
      const result = await service.getCourseList(mockedListNumber, mockedNumberOfCourseInList, null);

      expect(courseRepository.find).toHaveBeenCalledTimes(1);

      expect(result.length).toEqual(mockedNumberOfCourseInList);
    })
  })

  describe('getOneCourse',()=>{
    const findId : number = 1;
    const findErrorId : number = 999;

    it('should find a course',async ()=>{
      courseRepository.findOneBy.mockResolvedValue(mockedCourse);

      const result = await service.getOneCourseById(findId);
      expect(courseRepository.findOneBy).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockedCourse);
    });

    it("should return a NotFoundException", async () => {
      try{
        await service.getOneCourseById(findErrorId);
      }catch(e){
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('getOneCourseTitle',()=>{
    const findTitle : string = '웹의 이해';
    const findErrorTitle : string = '앱의 이해';

    it('should find a course',async ()=>{
      courseRepository.findOneBy.mockResolvedValue(mockedCourse);

      const result = await service.getOneCourseByTitle(findTitle);
      expect(courseRepository.findOneBy).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockedCourse);
    });

    it("should return a NotFoundException", async () => {
      try{
        await service.getOneCourseByTitle(findErrorTitle);
      }catch(e){
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('createCourse',()=>{
    const mockedCreateCourseDto : CreateCourseDto = {
      title : "웹의 이해",
      link : "https://www.example.link",
      img_link : "https://www.examplelink.link",
      rating : 0,
      price : 0
    };

    const mockedErrorCreateCourseDto = {
      title : "hi",
      img_link : "wwwheefsdfdsa"
    }
    
    it("should create a course", async () => {
      courseRepository.find.mockResolvedValue([]);
      const BeforeCreate = (await service.getAllCourse()).length;
      expect(courseRepository.find).toHaveBeenCalledTimes(1);
      
      const result = await service.createCourse(mockedCreateCourseDto);

      courseRepository.find.mockResolvedValue([mockedCourse]);
      const AfterCreate = (await service.getAllCourse()).length;
      expect(courseRepository.find).toHaveBeenCalledTimes(2);
      expect(AfterCreate).toEqual(BeforeCreate + 1);
    });

    it("should return a BadRequestException", async () => {
      try{
        await service.createCourse(mockedErrorCreateCourseDto as CreateCourseDto);
      }catch(e){
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('patchCourse',()=>{
    const mockedFindTitle : string = '웹의 이해';
    const mockedUpdateCourseTitle : string = '앱의 이해';
    const mockedErrorUpdateCourseTitle : string = 'AI의 이해';
    const mockedUpdateCourseDto : UpdateCourseDto = {
      title : "앱의 이해"
    }
    const mockedUpdateCourse : Course = {
      id : 1,
      title : "앱의 이해",
      link : "https://www.example.link",
      img_link : "https://www.examplelink.link",
      rating : 0,
      price : 0
    };
    const mockedErrorPatchCourseDto = {
      title : "hi",
      img_link : "wwwheefsdfdsa"
    }

    it("should patch a course", async () => {
      courseRepository.findOneBy.mockResolvedValue(mockedCourse);
      const BeforeUpdate = await service.getOneCourseByTitle(mockedFindTitle);
      expect(courseRepository.findOneBy).toHaveBeenCalledTimes(1);
      
      const result = await service.patchCourse(mockedFindTitle, mockedUpdateCourseDto)

      courseRepository.findOneBy.mockResolvedValue(mockedUpdateCourse);
      const AfterUpdate = await service.getOneCourseByTitle(mockedUpdateCourseTitle);
      expect(courseRepository.findOneBy).toHaveBeenCalledTimes(3);

      expect(BeforeUpdate.id).toEqual(AfterUpdate.id);
      expect(AfterUpdate.id).toEqual(mockedUpdateCourse.id);
      expect(AfterUpdate.title).toEqual(mockedUpdateCourse.title);
    });
    
    it("should return a NotFoundException", async () => {
      courseRepository.findOneBy.mockResolvedValue(mockedCourse);
      const BeforeUpdate = await service.getOneCourseByTitle(mockedFindTitle);
      expect(courseRepository.findOneBy).toHaveBeenCalledTimes(1);
      try{
        await service.patchCourse(mockedErrorUpdateCourseTitle, mockedUpdateCourseDto);
      }catch(e){
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
    
    it("should return a BadRequestException", async () => {
      courseRepository.findOneBy.mockResolvedValue(mockedCourse);
      const BeforeUpdate = await service.getOneCourseByTitle(mockedFindTitle);
      expect(courseRepository.findOneBy).toHaveBeenCalledTimes(1);
      try{
        await service.patchCourse(mockedFindTitle, mockedErrorPatchCourseDto as UpdateCourseDto);
      }catch(e){
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
  });
});

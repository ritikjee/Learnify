import { Request, Response } from 'express';
import { db } from '../utils/db';

export const onGetGroupCourses = async (req: Request, res: Response) => {
  const { groupid } = req.query as { groupid: string };
  if (!groupid) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid group id'
    });
  }
  try {
    const courses = await db.course.findMany({
      where: {
        groupId: groupid
      },
      take: 8,
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (courses && courses.length > 0) {
      return res.status(200).json({
        courses
      });
    }
    return res.status(404).json({
      message: 'No courses found'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const onCreateGroupCourse = async (req: Request, res: Response) => {
  const { groupid, courseid, name, image, description, privacy, published } =
    req.body;
  if (
    !groupid ||
    !courseid ||
    !name ||
    !description ||
    !privacy ||
    !published
  ) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid input data'
    });
  }
  try {
    const course = await db.group.update({
      where: {
        id: groupid
      },
      data: {
        courses: {
          create: {
            id: courseid,
            name,
            thumbnail: image,
            description,
            privacy,
            published
          }
        }
      }
    });

    if (course) {
      return res.status(200).json({
        message: 'Course created successfully'
      });
    }

    return res.status(400).json({
      message: 'Oops! something went wrong'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

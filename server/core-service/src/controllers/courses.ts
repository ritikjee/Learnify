import { Request, Response } from 'express';
import { db } from '../utils/db';
import { v4 } from 'uuid';

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

export const onGetCourseModules = async (req: Request, res: Response) => {
  const { courseId } = req.query as { courseId: string };
  if (!courseId) {
    return res.status(400).json({
      message: 'Invalid course id'
    });
  }
  try {
    const modules = await db.module.findMany({
      where: {
        courseId
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        section: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (modules && modules.length > 0) {
      return res.status(200).json({
        modules
      });
    }

    return res.status(404).json({
      message: 'No modules found'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const onCreateCourseModule = async (req: Request, res: Response) => {
  const { courseId, name } = req.body;
  if (!courseId || !name) {
    return res.status(400).json({
      message: 'Invalid input data'
    });
  }
  try {
    const courseModule = await db.course.update({
      where: {
        id: courseId
      },
      data: {
        modules: {
          create: {
            title: name,
            id: v4()
          }
        }
      }
    });

    if (courseModule) {
      return res.status(200).json({
        message: 'Module created successfully'
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

export const onUpdateModule = async (req: Request, res: Response) => {
  try {
    const { moduleId, type, content } = req.body;
    if (!moduleId || !type || !content) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid input data'
      });
    }
    if (type === 'NAME') {
      const title = await db.module.update({
        where: {
          id: moduleId
        },
        data: {
          title: content
        }
      });

      if (title) {
        return res.status(200).json({
          message: 'Module title updated successfully'
        });
      }

      return res.status(404).json({
        message: 'Module not found'
      });
    }
    return res.status(400).json({
      message: 'Invalid input data'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const onUpdateSection = async (req: Request, res: Response) => {
  try {
    const { sectionId, type, content } = req.body;

    if (!sectionId || !type) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid input data'
      });
    }
    if (type === 'NAME') {
      const title = await db.section.update({
        where: {
          id: sectionId
        },
        data: {
          name: content
        }
      });

      if (title) {
        return res.status(200).json({
          message: 'Section title updated successfully'
        });
      }

      return res.status(404).json({
        message: 'Section not found'
      });
    }
    if (type === 'COMPLETE') {
      const complete = await db.section.update({
        where: {
          id: sectionId
        },
        data: {
          complete: true
        }
      });

      if (complete) {
        return res.status(200).json({
          message: 'Section completed successfully'
        });
      }

      return res.status(404).json({
        message: 'Section not found'
      });
    }
    return res.status(400).json({
      message: 'Invalid input data'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const onCreateModuleSection = async (req: Request, res: Response) => {
  const { moduleId, sectionid } = req.body;
  if (!moduleId || !sectionid) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid input data'
    });
  }
  try {
    const section = await db.module.update({
      where: {
        id: moduleId
      },
      data: {
        section: {
          create: {
            id: sectionid
          }
        }
      }
    });

    if (section) {
      return res.status(200).json({
        message: 'Section created successfully'
      });
    }

    return res.status(404).json({
      message: 'Module not found'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const onGetSectionInfo = async (req: Request, res: Response) => {
  const { sectionid } = req.query as { sectionid: string };
  if (!sectionid) {
    return res.status(400).json({
      message: 'Invalid section id'
    });
  }
  try {
    const section = await db.section.findUnique({
      where: {
        id: sectionid
      }
    });

    if (section) {
      return res.status(200).json({
        section
      });
    }

    return res.status(404).json({
      message: 'Section not found'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const onUpdateCourseSectionContent = async (
  req: Request,
  res: Response
) => {
  const { sectionid, json, html, content } = req.body;
  if (!sectionid) {
    return res.status(400).json({
      message: 'Invalid input data'
    });
  }
  try {
    const section = await db.section.update({
      where: {
        id: sectionid
      },
      data: {
        JsonContent: json,
        htmlContent: html,
        content
      }
    });

    if (section) {
      return res.status(200).json({
        message: 'Section updated successfully'
      });
    }

    return res.status(404).json({
      message: 'Section not found'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

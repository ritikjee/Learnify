"use client";
import { Card } from "@/components/ui/card";
import { useCourses } from "@/hooks/courses";
import { truncateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type Props = {
  groupid: string;
};

const CourseList = ({ groupid }: Props) => {
  const { data } = useCourses(groupid);

  if (data?.error) {
    return <></>;
  }

  return data?.data?.courses?.map((course: any) => (
    <Link href={`/group/${groupid}/courses/${course.id}`} key={course.id}>
      <Card className="bg-transparent border-themeGray h-full rounded-xl overflow-hidden">
        <Image
          src={
            course.thumbnail ||
            "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
          }
          width={1920}
          height={1080}
          alt="cover"
          className="h-4/6 w-full opacity-60"
        />
        <div className="h-2/6 flex flex-col justify-center pl-5">
          <h2 className="text-lg text-white font-semibold">{course.name}</h2>
          <p className="text-sm text-themeTextGray">
            {truncateString(course.description)}
          </p>
        </div>
      </Card>
    </Link>
  ));
};

export default CourseList;

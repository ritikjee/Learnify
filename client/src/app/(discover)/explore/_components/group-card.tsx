import { Card } from "@/components/ui/card";
import { truncateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type Props = {
  id: string;
  name: string;
  category: string;
  createdAt: Date;
  userId: string;
  thumbnail: string | null;
  description: string | null;
  privacy: "PUBLIC" | "PRIVATE";
  preview?: string;
};

const GroupCard = ({
  id,
  userId,
  thumbnail,
  name,
  category,
  description,
  privacy,
  preview,
}: Props) => {
  return (
    <Link href={`/about/${id}`}>
      <Card className="bg-themeBlack border-themeGray rounded-xl overflow-hidden">
        <Image
          // WIP : Add AWS for upload
          src={
            preview ||
            thumbnail ||
            "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
          }
          alt="thumbnail"
          layout="responsive"
          width={300}
          height={200}
          className="w-full opacity-70 h-56"
        />
        <div className="p-6">
          <h3 className="text-lg text-themeTextGray font-bold">{name}</h3>
          <p className="text-base text-themeTextGray">
            {description && truncateString(description)}
          </p>
        </div>
      </Card>
    </Link>
  );
};

export default GroupCard;

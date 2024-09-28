"use client";

import { DropDown } from "@/components/global/dropdown";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CarotSort } from "@/icons";
import { Group } from "lucide-react";
import Link from "next/link";

type GroupDropDownProps = {
  members?: {
    Group: {
      channel: {
        id: string;
      }[];
      id: string;
      name: string;
      icon: string | null;
    } | null;
  }[];
  groups:
    | {
        status: number;
        groups: {
          channel: {
            id: string;
          }[];
          id: string;
          name: string;
          icon: string | null;
        }[];
      }
    | {
        status: number;
        groups?: undefined;
      };
};

export const GroupDropDown = ({ groups, members }: GroupDropDownProps) => {
  const userGroups = groups?.groups;

  if (!userGroups) return <p>Learnify.</p>;

  return (
    <DropDown
      title="Owned Groups"
      trigger={
        <Button
          variant="ghost"
          className="rounded-2xl hover:bg-themeGray font-medium flex gap-2"
        >
          Learnify.
          <CarotSort />
        </Button>
      }
    >
      {userGroups &&
        userGroups.length > 0 &&
        userGroups.map((item) => (
          <Link
            key={item.id}
            href={`/group/${item.id}/channel/${item.channel[0].id}`}
          >
            <Button
              variant="ghost"
              className="flex gap-2 w-full justify-start hover:bg-themeGray items-center"
            >
              <Group />
              {item.name}
            </Button>
          </Link>
        ))}
    </DropDown>
  );
};

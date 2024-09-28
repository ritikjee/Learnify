import GlassSheet from "@/components/global/glass-sheet";
import Search from "@/components/global/search";
import SideBar from "@/components/global/sidebar";
import { Button } from "@/components/ui/button";
import { Settings } from "@/icons";
import { Menu, Plus } from "lucide-react";
import Link from "next/link";

type NavbarProps = {
  groupid: string;
  userid: string;
};

// WIP : user logout and other details

export const Navbar = async ({ groupid, userid }: NavbarProps) => {
  return (
    <div className="bg-[#1A1A1D] py-2 px-3 md:px-7 md:py-5 flex gap-5 justify-between md:justify-end items-center">
      <GlassSheet trigger={<Menu className="md:hidden cursor-pointer" />}>
        <SideBar groupid={groupid} userid={userid} mobile />
      </GlassSheet>
      <Search
        searchType="POSTS"
        className="rounded-full border-themeGray bg-black !opacity-100 px-3"
        placeholder="Search..."
      />
      <Link href={`/group/${groupid}/setting`} className="hidden md:inline">
        <Button
          variant="outline"
          className="bg-themeBlack rounded-2xl flex gap-2 border-themeGray hover:bg-themeGray"
        >
          <Settings />
        </Button>
      </Link>
      <Link href={`/group/create`} className="hidden md:inline">
        <Button
          variant="outline"
          className="bg-themeBlack rounded-2xl flex gap-2 border-themeGray hover:bg-themeGray"
        >
          <Plus />
        </Button>
      </Link>
    </div>
  );
};

"use client";

import GroupCard from "@/app/(discover)/explore/_components/group-card";
import { FormGenerator } from "@/components/global/from-generator";
import { Loader } from "@/components/global/loader";
import BlockTextEditor from "@/components/global/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGroupSettings } from "@/hooks/groups";
import Image from "next/image";

type Props = {
  groupId: string;
};

const GroupSettingsForm = ({ groupId }: Props) => {
  const {
    data,
    register,
    errors,
    onUpdate,
    isPending,
    previewIcon,
    previewThumbnail,
    onJsonDescription,
    setJsonDescription,
    setOnDescription,
    onDescription,
  } = useGroupSettings(groupId);

  return (
    <form
      className="flex flex-col h-full w-full items-start gap-y-5"
      onSubmit={onUpdate}
    >
      <div className="flex 2xl:flex-row flex-col gap-10">
        <div className="flex flex-col gap-3 items-start">
          <p>Group Preview</p>

          <GroupCard
            id={data?.data?.group?.id}
            createdAt={data?.data?.group?.createdAt}
            userId={data?.data?.group?.userId}
            category={data?.data?.group?.category}
            description={data?.data?.group?.description}
            privacy={data?.data?.group?.privacy}
            thumbnail={data?.data?.group?.thumbnail}
            name={data?.data?.group?.name}
            preview={previewThumbnail}
          />

          <Label
            htmlFor="thumbnail-upload"
            className="border-2 border-themeGray bg-themeGray/50 px-5 py-3 rounded-lg hover:bg-themeBlack cursor-pointer"
          >
            <Input
              type="file"
              id="thumbnail-upload"
              className="hidden"
              {...register("thumbnail")}
            />
            Change Cover
          </Label>
        </div>
        <div className="flex-1 flex flex-col gap-3 items-start">
          <p className="">Icon Preview</p>

          <Image
            className="w-20 h-20 rounded-xl"
            width={80}
            height={80}
            src={
              previewIcon ||
              (data?.data?.group?.icon && `${data?.data?.group?.icon}`) ||
              "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
            }
            alt="icon"
          />
          <Label
            className="border-2 border-themeGray bg-themeGray/50 px-5 py-3 rounded-lg cursor-pointer hover:bg-themeBlack"
            htmlFor="icon-upload"
          >
            <Input
              type="file"
              id="icon-upload"
              className="hidden"
              {...register("icon")}
            />
            Change Icon
          </Label>
        </div>
      </div>
      <div className="flex flex-col w-full gap-y-5">
        <FormGenerator
          register={register}
          name="name"
          placeholder={data?.data?.group?.name}
          label="Group Name"
          errors={errors}
          inputType="input"
          type="text"
        />
        <Label className="flex flex-col gap-y-2">
          <p>Group Description</p>
          <BlockTextEditor
            errors={errors}
            name="jsondescription"
            min={150}
            max={10000}
            textContent={onDescription}
            content={onJsonDescription}
            setContent={setJsonDescription}
            setTextContent={setOnDescription}
          />
        </Label>
        <Button className="self-start" type="submit">
          <Loader loading={isPending}>Update Settings</Loader>
        </Button>
      </div>
    </form>
  );
};

export default GroupSettingsForm;

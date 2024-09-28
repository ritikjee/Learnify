"use client";

import {
  onGetExploreGroup,
  onGetGroupInfo,
  onSearchGroups,
  onUpdateGroupGallery,
  onUpDateGroupSettings,
} from "@/actions/groups";
import { GroupSettingsSchema } from "@/components/forms/group-settings/schema";
import {
  GroupStateProps,
  onClearSearch,
  onSearch,
} from "@/redux/slices/search-slice";
import { AppDispatch } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { JSONContent } from "novel";
import { toast } from "sonner";
import { z } from "zod";
import {
  onClearList,
  onInfiniteScroll,
} from "@/redux/slices/infinite-scroll-slice";
import { validateURLString } from "@/lib/utils";
import { UpdateGallerySchema } from "@/components/forms/media-galley/schema";

export const useSearch = (search: "GROUPS" | "POSTS") => {
  const [query, setQuery] = useState<string>("");
  const [debounce, setDebounce] = useState<string>("");

  const dispatch: AppDispatch = useDispatch();

  const onSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value);

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebounce(query);
    }, 1000);
    return () => clearTimeout(delayInputTimeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, 1000]);

  const { refetch, data, isFetched, isFetching } = useQuery({
    queryKey: ["search-data", debounce],
    queryFn: async ({ queryKey }) => {
      if (search === "GROUPS") {
        const groups = await onSearchGroups(search, queryKey[1]);
        return groups;
      }
    },
    enabled: false,
  });

  if (isFetching)
    dispatch(
      onSearch({
        isSearching: true,
        data: [],
      })
    );

  if (isFetched)
    dispatch(
      onSearch({
        isSearching: false,
        status: data?.data ? 200 : 400,
        data: data?.data?.groups || [],
        debounce,
      })
    );

  useEffect(() => {
    if (debounce) refetch();
    if (!debounce) dispatch(onClearSearch());
    return () => {
      debounce;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounce]);

  return { query, onSearchQuery };
};

export const useGroupSettings = (groupid: string) => {
  const { data } = useQuery({
    queryKey: ["group-info"],
    queryFn: () => onGetGroupInfo(groupid),
  });

  const jsonContent = data?.data?.group?.jsonDescription
    ? JSON.parse(data?.data?.group?.jsonDescription as string)
    : undefined;

  const [onJsonDescription, setJsonDescription] = useState<
    JSONContent | undefined
  >(jsonContent);

  const [onDescription, setOnDescription] = useState<string | undefined>(
    data?.data?.group?.description || undefined
  );

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
    setValue,
  } = useForm<z.infer<typeof GroupSettingsSchema>>({
    resolver: zodResolver(GroupSettingsSchema),
    mode: "onChange",
  });
  const [previewIcon, setPreviewIcon] = useState<string | undefined>(undefined);
  const [previewThumbnail, setPreviewThumbnail] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const previews = watch(({ thumbnail, icon }) => {
      if (!icon) return;
      if (icon[0]) {
        setPreviewIcon(URL.createObjectURL(icon[0]));
      }
      if (thumbnail[0]) {
        setPreviewThumbnail(URL.createObjectURL(thumbnail[0]));
      }
    });
    return () => previews.unsubscribe();
  }, [watch]);

  const onSetDescriptions = () => {
    const JsonContent = JSON.stringify(onJsonDescription);
    setValue("jsondescription", JsonContent);
    setValue("description", onDescription);
  };

  useEffect(() => {
    onSetDescriptions();
    return () => {
      onSetDescriptions();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onJsonDescription, onDescription]);

  const { mutate: update, isPending } = useMutation({
    // WIP : Add AWS for upload
    mutationKey: ["group-settings"],
    mutationFn: async (values: z.infer<typeof GroupSettingsSchema>) => {
      if (values.thumbnail && values.thumbnail.length > 0) {
        // const uploaded = await upload.uploadFile(values.thumbnail[0]);
        const updated = await onUpDateGroupSettings(
          groupid,
          "IMAGE",
          "",
          `/group/${groupid}/settings`
        );
        if (updated.error) {
          return toast("Error", {
            description: "Oops! looks like your form is empty",
          });
        }
      }
      if (values.icon && values.icon.length > 0) {
        const updated = await onUpDateGroupSettings(
          groupid,
          "ICON",
          "",
          `/group/${groupid}/settings`
        );
        if (updated.error) {
          return toast("Error", {
            description: "Oops! looks like your form is empty",
          });
        }
      }
      if (values.name) {
        const updated = await onUpDateGroupSettings(
          groupid,
          "NAME",
          values.name,
          `/group/${groupid}/settings`
        );
        if (updated.error) {
          return toast("Error", {
            description: "Oops! looks like your form is empty",
          });
        }
      }

      if (values.description) {
        const updated = await onUpDateGroupSettings(
          groupid,
          "DESCRIPTION",
          values.description,
          `/group/${groupid}/settings`
        );
        if (updated.error) {
          return toast("Error", {
            description: "Oops! looks like your form is empty",
          });
        }
      }
      if (values.jsondescription) {
        const updated = await onUpDateGroupSettings(
          groupid,
          "JSONDESCRIPTION",
          values.jsondescription,
          `/group/${groupid}/settings`
        );
        if (updated.error) {
          return toast("Error", {
            description: "Oops! looks like your form is empty",
          });
        }
      }
      if (
        !values.description &&
        !values.name &&
        !values.thumbnail.length &&
        !values.icon.length &&
        !values.jsondescription
      ) {
        return toast("Error", {
          description: "Oops! looks like your form is empty",
        });
      }
      return toast("Success", {
        description: "Group data updated",
      });
    },
  });
  const router = useRouter();
  const onUpdate = handleSubmit(async (values) => update(values));
  if (data?.error) router.push(`/group/create`);

  return {
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
  };
};

export const useGroupList = (query: string) => {
  const { data } = useQuery({
    queryKey: [query],
  });

  const dispatch: AppDispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(onClearList({ data: [] }));
  }, []);

  const { groups, status } = data as {
    groups: GroupStateProps[];
    status: number;
  };

  return { groups, status };
};

export const useExploreSlider = (query: string, paginate: number) => {
  const [onLoadSlider, setOnLoadSlider] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const { data, refetch, isFetching, isFetched } = useQuery({
    queryKey: ["fetch-group-slides"],
    queryFn: () => onGetExploreGroup(query, paginate | 0),
    enabled: false,
  });

  if (isFetched && data?.data && data?.data?.groups) {
    dispatch(onInfiniteScroll({ data: data?.data?.groups }));
  }

  useEffect(() => {
    setOnLoadSlider(true);
    return () => {
      onLoadSlider;
    };
  }, []);

  return { refetch, isFetching, data, onLoadSlider };
};

export const useGroupInfo = () => {
  // WIP : Remove authentication
  const { data } = useQuery<{ data: any; error: any }>({
    queryKey: ["about-group-info"],
  });

  const router = useRouter();

  if (data?.error) router.push("/explore");

  const { data: group, error } = data as {
    data: any;
    error: any;
  };

  if (error) router.push("/explore");

  return {
    group: group?.group,
  };
};

export const useGroupAbout = (
  description: string | null,
  jsonDescription: string | null,
  htmlDescription: string | null,
  currentMedia: string,
  groupid: string
) => {
  const editor = useRef<HTMLFormElement | null>(null);
  const mediaType = validateURLString(currentMedia);
  const [activeMedia, setActiveMedia] = useState<
    | {
        url: string | undefined;
        type: string;
      }
    | undefined
  >(
    mediaType.type === "IMAGE"
      ? {
          url: currentMedia,
          type: mediaType.type,
        }
      : { ...mediaType }
  );

  const jsonContent = jsonDescription
    ? JSON.parse(jsonDescription as string)
    : undefined;

  const [onJsonDescription, setJsonDescription] = useState<
    JSONContent | undefined
  >(jsonContent);

  const [onDescription, setOnDescription] = useState<string | undefined>(
    description || undefined
  );

  const [onHtmlDescription, setOnHtmlDescription] = useState<
    string | undefined
  >(htmlDescription || undefined);

  const [onEditDescription, setOnEditDescription] = useState<boolean>(false);

  const {
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<z.infer<typeof GroupSettingsSchema>>({
    resolver: zodResolver(GroupSettingsSchema),
  });

  const onSetDescriptions = () => {
    const JsonContent = JSON.stringify(onJsonDescription);
    setValue("jsondescription", JsonContent);
    setValue("description", onDescription);
    setValue("htmldescription", onHtmlDescription);
  };

  useEffect(() => {
    onSetDescriptions();
    return () => {
      onSetDescriptions();
    };
  }, [onJsonDescription, onDescription]);

  const onEditTextEditor = (event: Event) => {
    if (editor.current) {
      !editor.current.contains(event.target as Node | null)
        ? setOnEditDescription(false)
        : setOnEditDescription(true);
    }
  };

  useEffect(() => {
    document.addEventListener("click", onEditTextEditor, false);
    return () => {
      document.removeEventListener("click", onEditTextEditor, false);
    };
  }, []);

  const { mutate, isPending } = useMutation({
    // WIP : Check for error
    mutationKey: ["about-description"],
    mutationFn: async (values: z.infer<typeof GroupSettingsSchema>) => {
      if (values.description) {
        const { error } = await onUpDateGroupSettings(
          groupid,
          "DESCRIPTION",
          values.description,
          `/about/${groupid}`
        );
        if (!error) {
          return toast("Error", {
            description: "Oops! looks like your form is empty",
          });
        }
      }
      if (values.jsondescription) {
        const { data, error } = await onUpDateGroupSettings(
          groupid,
          "JSONDESCRIPTION",
          values.jsondescription,
          `/about/${groupid}`
        );

        if (!error) {
          return toast("Error", {
            description: "Oops! looks like your form is empty",
          });
        }
      }
      if (values.htmldescription) {
        const { error } = await onUpDateGroupSettings(
          groupid,
          "HTMLDESCRIPTION",
          values.htmldescription,
          `/about/${groupid}`
        );
        if (!error) {
          return toast("Error", {
            description: "Oops! looks like your form is empty",
          });
        }
      }
      if (
        !values.description &&
        !values.jsondescription &&
        !values.htmldescription
      ) {
        return toast("Error", {
          description: "Oops! looks like your form is empty",
        });
      }
      return toast("Success", {
        description: "Group description updated",
      });
    },
  });
  const onSetActiveMedia = (media: { url: string | undefined; type: string }) =>
    setActiveMedia(media);

  const onUpdateDescription = handleSubmit(async (values) => {
    mutate(values);
  });

  return {
    setOnDescription,
    onDescription,
    setJsonDescription,
    onJsonDescription,
    errors,
    onEditDescription,
    editor,
    activeMedia,
    onSetActiveMedia,
    setOnHtmlDescription,
    onUpdateDescription,
    isPending,
  };
};

export const useMediaGallery = (groupid: string) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<z.infer<typeof UpdateGallerySchema>>({
    resolver: zodResolver(UpdateGallerySchema),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-gallery"],
    mutationFn: async (values: z.infer<typeof UpdateGallerySchema>) => {
      if (values.videourl) {
        const { data, error: updateError } = await onUpdateGroupGallery(
          groupid,
          values.videourl
        );
        if (updateError) {
          return toast("Error", {
            description: updateError?.message || "Something went wrong",
          });
        }
      }
      if (values.image && values.image.length) {
        // WIP : set up aws for upload

        let count = 0;
        while (count < values.image.length) {
          // const uploaded = await upload.uploadFile(values.image[count]);
          // if (uploaded) {
          //   const update = await onUpdateGroupGallery(groupid, uploaded.uuid);
          //   if (update?.status !== 200) {
          //     toast("Error", {
          //       description: update?.message,
          //     });
          //     break;
          //   }
          // } else {
          //   toast("Error", {
          //     description: "Looks like something went wrong!",
          //   });
          //   break;
          // }

          count++;
        }
      }

      return toast("Success", {
        description: "Group gallery updated",
      });
    },
  });

  const onUpdateGallery = handleSubmit(async (values) => mutate(values));

  return {
    register,
    errors,
    onUpdateGallery,
    isPending,
  };
};

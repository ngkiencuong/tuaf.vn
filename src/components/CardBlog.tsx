"use client";

import { clean } from "@/lib/sanitizeHtml";
import {
  Avatar,
  AvatarBadge,
  Box,
  Center,
  Flex,
  Heading,
  Stack,
  Text
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const CardBlog = ({
  image,
  title,
  desc,
  path,
  tag,
  bgTag,
  date,
  imageH,
  preview
}: {
  image?: string;
  title: string;
  desc: string;
  path: string;
  tag?: string;
  bgTag?: string;
  date?: string;
  imageH?: string;
  preview?: boolean;
}) => {
  const [isMounted, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);
  return (
    <Center
      as={Link}
      style={{ textDecoration: "none" }}
      href={path}
      py={6}
      pos={"relative"}
      transition={"all ease .4s"}
      _hover={{ transform: "translateY(-6px)" }}
      className="card-blog"
      h={"100%"}
    >
      <Flex
        flexDir={"column"}
        justify={"space-between"}
        maxW={"445px"}
        w={"full"}
        bg={"white"}
        boxShadow={"2xl"}
        rounded={"sm"}
        p={6}
        overflow={"hidden"}
        h={"100%"}
      >
        <Box>
          {!preview && (
            <Box
              bg={"gray.100"}
              mt={-6}
              mx={-6}
              mb={6}
              pos={"relative"}
              aspectRatio={260 / 173}
              overflow={"hidden"}
            >
              <Box
                bg={"gray.100"}
                mt={-6}
                mx={-6}
                mb={6}
                pos={"relative"}
                aspectRatio={260 / 173}
                overflow={"hidden"}
              >
                <Image
                  width={600}
                  height={350}
                  src={image || `/blog.jpeg`}
                  style={{ maxHeight: imageH }}
                  alt={title}
                />
              </Box>
            </Box>
          )}
          <Stack>
            <Box>
              {tag && (
                <Text
                  fontWeight={600}
                  fontSize={".8rem"}
                  bg={bgTag || "green.500"}
                  py={"6px"}
                  px={"12px"}
                  color={"white"}
                  as={"span"}
                  rounded={"md"}
                >
                  {tag}
                </Text>
              )}
            </Box>
            <Heading
              className="event-heading"
              color={"gray.700"}
              fontSize={{ base: "sm", lg: "md" }}
              fontFamily={"body"}
              _hover={{ color: "red.400" }}
              css={{
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
              dangerouslySetInnerHTML={{ __html: clean(title) }}
            />
            {isMounted && (
              <Text
                color={"gray.500"}
                fontSize={".8rem"}
                css={{
                  display: "-webkit-box",
                  WebkitLineClamp: "4",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
                dangerouslySetInnerHTML={{ __html: clean(desc) }}
              />
            )}
          </Stack>
        </Box>
        <Stack mt={6} direction={"row"} spacing={4} align={"center"}>
          <Avatar bg={"teal.300"} size={"sm"}>
            <AvatarBadge boxSize="1.25em" bg="green.500" />
          </Avatar>
          <Stack direction={"column"} spacing={0} fontSize={"sm"}>
            <Text fontWeight={600}>Admin</Text>
            <Text color={"gray.500"}>{date}</Text>
          </Stack>
        </Stack>
      </Flex>
    </Center>
  );
};

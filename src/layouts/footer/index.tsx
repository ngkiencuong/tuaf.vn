"use client";

import { useModal } from "@/components/ModalContext";
import {
  Box,
  Container,
  GridItem,
  Heading,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
  UnorderedList,
  VisuallyHidden,
  chakra,
  useColorModeValue
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { FaFacebook, FaTiktok } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import { Logo } from "../components/Logo";

const InputRes = dynamic(() =>
  import("@/components/InputRes").then((mod) => mod.InputRes)
);

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
      {children}
    </Text>
  );
};

const SocialButton = ({
  children,
  label,
  href
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200")
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export const Footer = () => {
  const { onOpen } = useModal();
  const [isVisible, setIsVisible] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.5 // Kích hoạt khi 50% của phần tử hiển thị trong viewport
  });

  useEffect(() => {
    // Kiểm tra xem trongView và isVisible đều là true
    if (inView && !isVisible) {
      setIsVisible(true); // Nếu không thì hiển thị
    }
  }, [inView, isVisible]);

  const [page_content, setPageContent] = useState<any>(null);

  useEffect(() => {
    const getPageContent = async () => {
      try {
        const res = await fetch(`/api/content-page/?type=trang-chu`, {
          next: { revalidate: 3 }
        });
        if (!res.ok) {
          throw new Error(`Posts fetch failed with status: ${res.statusText}`);
        }
        const data = await res.json();
        setPageContent(data?.posts[0]);
      } catch (error) {
        console.log(error);
      }
    };
    getPageContent();
  }, []);

  return (
    <>
      <Box bg={"green.800"} color={"White"}>
        <Container as={Stack} maxW={"6xl"} py={10}>
          <SimpleGrid columns={{ base: 1, lg: 3 }} pb={"32px"} spacing={"8"}>
            <GridItem>
              <Heading size="md" mb={4}>
                {page_content?.acf?.top_footer?.info?.name ||
                  "TRƯỜNG ĐẠI HỌC NÔNG LÂM THÁI NGUYÊN"}
              </Heading>
              <Text>
                {page_content?.acf?.top_footer?.info?.address ||
                  "Địa chỉ: Tổ 10, Xã Quyết Thắng, TP Thái Nguyên, Thái Nguyên"}
              </Text>
            </GridItem>
            <GridItem>
              <Heading size="md" textAlign="center" mb={4}>
                {page_content?.acf?.top_footer?.text || "Đăng ký nhận bản tin"}
              </Heading>
              <Box maxW="md">
                <InputRes
                  placeholder="Nhập email để đăng ký"
                  label="Đăng ký"
                  onClick={onOpen}
                />
              </Box>
            </GridItem>
            <GridItem></GridItem>
          </SimpleGrid>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 5 }} spacing={8}>
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <Stack align={"flex-start"}>
                <ListHeader>
                  {page_content?.acf?.block_12?.block_1?.title ||
                    "Trạm tuyển sinh"}
                </ListHeader>
                <Box>
                  {page_content?.acf?.block_12?.block_1?.desc ||
                    "Trường Đại học Nông lâm Thái Nguyên - trạm tuyển sinh AUM"}
                </Box>
                <UnorderedList>
                  <ListItem>
                    {page_content?.acf?.block_12?.block_1?.list_1 ||
                      "Hà Nội: Số 116 Trần Vĩ, Phường Mai Dịch, Quận Cầu Giấy, Thành Phố Hà Nội"}
                  </ListItem>
                  <ListItem>
                    {page_content?.acf?.block_12?.block_1?.list_2 ||
                      "Hồ Chí Minh: Số 91 Ký Con, phường Nguyễn Thái Bình, Quận 1, TP Hồ Chí Minh"}
                  </ListItem>
                </UnorderedList>
                <Box
                  as={Link}
                  prefetch={false}
                  href={`tel:${
                    page_content?.acf?.block_12?.block_1?.contact_1 ||
                    "0941011771"
                  }`}
                >
                  Hotline:
                  {page_content?.acf?.block_12?.block_1?.contact_1 ||
                    "0941011771"}
                </Box>
                <Box
                  as={Link}
                  prefetch={false}
                  href={`mailto:${
                    page_content?.acf?.block_12?.block_1?.contact_2 ||
                    "tuaf@gvcn.vn"
                  }`}
                >
                  Email:
                  {page_content?.acf?.block_12?.block_1?.contact_2 ||
                    "tuaf@gvcn.vn"}
                </Box>
              </Stack>
            </GridItem>

            <Stack align={"flex-start"}>
              <ListHeader>
                {page_content?.acf?.block_12?.block_2?.title || "Hỗ trợ"}
              </ListHeader>
              <Link
                prefetch={false}
                href={
                  page_content?.acf?.block_12?.block_2?.link_1 || "/gioi-thieu"
                }
              >
                {page_content?.acf?.block_12?.block_2?.text_1 || "Về chúng tôi"}
              </Link>
              <Link
                prefetch={false}
                href={
                  page_content?.acf?.block_12?.block_2?.link_2 ||
                  "/lich-khai-giang"
                }
              >
                {page_content?.acf?.block_12?.block_2?.text_2 ||
                  "Lịch khai giảng"}
              </Link>
              <Link
                prefetch={false}
                href={
                  page_content?.acf?.block_12?.block_2?.link_3 || "/dang-ky"
                }
              >
                {page_content?.acf?.block_12?.block_2?.text_3 || "Đăng ký"}
              </Link>
              <Link
                prefetch={false}
                href={
                  page_content?.acf?.block_12?.block_2?.link_4 || "/tin-tuc"
                }
              >
                {page_content?.acf?.block_12?.block_2?.text_4 || "Tin tức"}
              </Link>
              <Link
                prefetch={false}
                href={"/hop-tac"}
                style={{ marginTop: "4px" }}
              >
                <Image
                  loading="lazy"
                  src={
                    page_content?.acf?.block_12?.block_2?.image ||
                    "/hop-tac.png"
                  }
                  alt="Tìm đối tác"
                  width={348}
                  height={232}
                />
              </Link>
            </Stack>

            <Stack align={"flex-start"}>
              <ListHeader>
                {page_content?.acf?.block_34?.block_3?.title || "Nhận diện"}
              </ListHeader>
              <Logo
                logo={
                  page_content?.acf?.block_34?.block_3?.image_logo ||
                  `/logo-tuaf.png`
                }
              />
              <ListHeader>
                {page_content?.acf?.block_34?.block_3?.title_2 ||
                  "Hợp tác tuyển sinh"}
              </ListHeader>
              <Link prefetch={false} href={"https://timdoitac.aum.edu.vn/"}>
                <Image
                  loading="lazy"
                  src={
                    page_content?.acf?.block_34?.block_3?.image ||
                    "/timdoitac.jpg"
                  }
                  alt="Tìm đối tác"
                  width={348}
                  height={232}
                />
              </Link>
            </Stack>

            <Stack align={"flex-start"}>
              <ListHeader>
                {page_content?.acf?.block_34?.block_4?.title || "Mạng xã hội"}
              </ListHeader>
              <Stack direction={"row"} spacing={6}>
                <SocialButton
                  label={"Facebook"}
                  href={
                    page_content?.acf?.block_34?.block_4?.link_icon_facebook ||
                    "https://www.facebook.com/daihoctuxa.etuaf/"
                  }
                >
                  <FaFacebook />
                </SocialButton>
                {/* <SocialButton label={"YouTube"} href={"#"}>
                  <FaYoutube />
                </SocialButton> */}
                <SocialButton
                  label={"Tiktok"}
                  href={
                    page_content?.acf?.block_34?.block_4?.link_icon_tiktok ||
                    "https://www.tiktok.com/@toiyeunongnghiep"
                  }
                >
                  <FaTiktok />
                </SocialButton>
              </Stack>
              <Box ref={ref}>
                {isVisible && (
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3709.969032099417!2d105.80996617670684!3d21.587131868363855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313527aacf5b4b9b%3A0x7787e7dac2d88b22!2zVHJ1bmcgdMOibSDEkMOgbyB04bqhbyBU4burIHhhIMSQ4bqhaSBI4buNYyBUaMOhaSBOZ3V5w6pu!5e0!3m2!1sen!2s!4v1697154758775!5m2!1sen!2s"
                    width="100%"
                    height="220"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                )}
              </Box>
            </Stack>
          </SimpleGrid>
        </Container>

        <Box borderTopWidth={1} borderStyle={"solid"} borderColor={"gray.200"}>
          <Container
            as={Stack}
            maxW={"6xl"}
            py={4}
            direction={{ base: "column", md: "row" }}
            spacing={4}
            justify={{ md: "center" }}
            align={{ md: "center" }}
          >
            <Text textAlign="center">© 2023 Copyright by IT AUM</Text>
          </Container>
        </Box>
      </Box>
    </>
  );
};

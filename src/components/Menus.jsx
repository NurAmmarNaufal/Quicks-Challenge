import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Tooltip, Divider, Spin, Button } from "antd";
import {
  SearchOutlined,
  LoadingOutlined,
  ArrowLeftOutlined,
  CloseOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";

import groupAvatar from "../assets/menus/group-avatar.png";
import menusIcon from "../assets/menus/menu.png";
import chatIcon from "../assets/menus/chat.png";
import taskIcon from "../assets/menus/task.png";
import chatIconActive from "../assets/menus/chat-active.png";
import taskIconActive from "../assets/menus/task-active.png";
import axios from "axios";
import Task from "./Task";

const Menus = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [toggleMenu, setToggleMenu] = useState("menu");
  const [redDot, setRedDot] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingConnectTeam, setLoadingConnectTeam] = useState(false);
  const [messageStage, setMessageStage] = useState(1);
  const [sendData, setSendData] = useState("");
  const [groupData, setGroupData] = useState([]);
  const [chatData, setChatData] = useState([]);

  const [actionYou, setActionYou] = useState(-1);
  const [actionOther, setActionOther] = useState(-1);

  const [statePopUpNewMessage, setStatePopUpNewMessage] = useState(true);

  const [indexing, setIndexing] = useState(0);

  const [reply, setReply] = useState({
    show: false,
    replyTo: "",
    msg: "",
  });

  const changeMenu = (choosen) => {
    if (choosen === "menu") {
      setIsOpen(false);
      setToggleMenu(choosen);
    } else if (choosen === "inbox") {
      setIsOpen(false);
      setToggleMenu(choosen);
    } else if (choosen === "task") {
      setIsOpen(false);
      setToggleMenu(choosen);
    }
  };

  const getChatGroup = async () => {
    const data = await axios.get("./groupApi.json");
    setGroupData(data.data);
    setLoading(false);
  };

  const getChat = async (index) => {
    const data = await axios.get("./chatApi.json");
    if (index === 0) {
      setChatData(data.data[0]);
    } else {
      setChatData(data.data[1]);
    }
    setMessageStage(2);
  };

  const scrollBottom = () => {
    const targetDiv = document.getElementById("chatWindow");
    if (targetDiv) {
      targetDiv.scrollTo({
        top: targetDiv.scrollHeight,
        behavior: "smooth",
      });
      setStatePopUpNewMessage(false);
    }
  };

  useEffect(() => {
    if (toggleMenu === "inbox") {
      setLoading(true);
      setTimeout(() => {
        getChatGroup();
      }, 2000);
    }
  }, [toggleMenu]);

  useEffect(() => {
    const targetDiv = document.getElementById("chatWindow");

    const handleScroll = () => {
      if (targetDiv.scrollHeight - 100 - (targetDiv.clientHeight - 100)) {
        setStatePopUpNewMessage(false);
      }
    };

    if (targetDiv) {
      targetDiv.addEventListener("scroll", handleScroll);

      return () => {
        targetDiv.removeEventListener("scroll", handleScroll);
      };
    }
  }, [messageStage]);

  const EditDelete = () => {
    return (
      <div className="bg-white border-primary_light_gray border w-[100px] rounded z-50">
        <p className="border-b border-primary_light_gray py-1  pl-3 text-primary_blue cursor-pointer hover:bg-blue-50">
          Edit
        </p>
        <p className="py-1 pl-3 text-red-500 cursor-pointer hover:bg-red-50">
          Delete
        </p>
      </div>
    );
  };
  const ShareReply = ({ data }) => {
    return (
      <div className="bg-white border-primary_light_gray border w-[100px] rounded absolute z-50">
        <p className="border-b border-primary_light_gray py-1  pl-3 text-primary_blue cursor-pointer hover:bg-blue-50">
          Share
        </p>
        <p
          className="py-1 pl-3 text-primary_blue cursor-pointer hover:bg-blue-50"
          onClick={() => {
            setReply({ show: true, replyTo: data.name, msg: data.msg });
            setActionOther(-1);
          }}
        >
          Reply
        </p>
      </div>
    );
  };

  const handleAction = (subject, index) => {
    if (subject === "You") {
      actionYou !== index ? setActionYou(index) : setActionYou(-1);
      setActionOther(-1);
    } else {
      actionOther !== index ? setActionOther(index) : setActionOther(-1);
      setActionYou(-1);
    }
  };

  const getHour = () => {
    // Membuat objek Date yang merepresentasikan waktu saat ini
    const currentTime = new Date();

    // Mendapatkan jam dan menit dari waktu saat ini
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    // Mengonversi nilai jam dan menit ke dalam format yang diinginkan (misalnya, dua digit)
    const formattedHour = currentHour < 10 ? "0" + currentHour : currentHour;
    const formattedMinute =
      currentMinute < 10 ? "0" + currentMinute : currentMinute;

    // Menggabungkan nilai jam dan menit menjadi sebuah string
    const currentTimeString = formattedHour + ":" + formattedMinute;

    return currentTimeString; // Output: Contoh: "09:30"
  };

  const handleSend = () => {
    let newData = {};

    if (reply.show) {
      newData = {
        id: Math.random(),
        name: "You",
        text: sendData,
        time: getHour(),
        replyTo: {
          name: reply.replyTo,
          msg: reply.msg,
        },
        color: {
          main: "#9B51E0",
          sub: "#EEDCFF",
        },
      };
    } else {
      newData = {
        id: Math.random(),
        name: "You",
        text: sendData,
        time: getHour(),
        replyTo: {
          name: "",
          msg: "",
        },
        color: {
          main: "#9B51E0",
          sub: "#EEDCFF",
        },
      };
    }

    if (indexing === 0) {
      chatData.chats
        .find((chat) => chat.date === "New Message")
        .chat.push(newData);

      setLoadingConnectTeam(false);
    } else {
      chatData.chats.find((chat) => chat.date === "").chat.push(newData);
    }

    setSendData("");
    setReply({
      show: false,
      replyTo: "",
      msg: "",
    });
    setTimeout(() => {
      scrollBottom();
      if (chatData.chats[0].chat[0].name === "FastVisa Support") {
        setLoadingConnectTeam(true);
      }
    }, 500);
  };

  const toConversation = (index) => {
    setIndexing(index);
    getChat(index);
  };

  return (
    <>
      {toggleMenu === "menu" && (
        <div>
          <Tooltip title="Menu">
            <img
              src={menusIcon}
              alt="menu"
              onClick={() => setIsOpen(!isOpen)}
              className="h-[40px] cursor-pointer absolute bottom-5 right-5 z-[9]"
            />
          </Tooltip>
          <Tooltip title="Inbox">
            <motion.img
              initial={{ right: 20 }}
              animate={{ right: isOpen ? 80 : 20, opacity: isOpen ? 1 : 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 50,
                duration: 0.5,
              }}
              src={chatIcon}
              alt="chat"
              onClick={() => changeMenu("inbox")}
              className="h-[40px] cursor-pointer absolute bottom-5 right-5"
            />
          </Tooltip>
          <Tooltip title="Task">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ right: isOpen ? 140 : 20, opacity: isOpen ? 1 : 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 50,
                duration: 0.5,
              }}
              src={taskIcon}
              alt="task"
              onClick={() => changeMenu("task")}
              className="h-[40px] cursor-pointer absolute bottom-5 right-5"
            />
          </Tooltip>
        </div>
      )}
      {toggleMenu === "inbox" && (
        <>
          <div>
            <Tooltip title="Back">
              <img
                src={chatIconActive}
                alt="menu"
                onClick={() => changeMenu("menu")}
                className="h-[40px] cursor-pointer absolute bottom-5 right-5 z-[9]"
              />
            </Tooltip>
            <Tooltip title="Task">
              <img
                src={taskIcon}
                alt="task"
                onClick={() => changeMenu("task")}
                className="h-[40px] cursor-pointer absolute bottom-5 right-[80px]"
              />
            </Tooltip>
          </div>

          {messageStage === 1 ? (
            <>
              {/* window */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 150,
                  duration: 1,
                }}
                className="w-[40%] h-[70%] bg-white bottom-[80px] right-5 absolute rounded py-[22px] px-[32px]"
              >
                {/* search bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="search"
                    className="border-2 border-primary_light_gray rounded-md px-10 w-full"
                  />
                  <SearchOutlined className="absolute right-10 bottom-1" />
                </div>
                {/* content */}
                {!loading ? (
                  <section>
                    {groupData.map((item, i) => (
                      <div className="relative" key={i}>
                        {i === 0 && redDot && (
                          <div className="w-2 h-2 rounded-full bg-red-500 absolute right-5 top-7" />
                        )}
                        <div
                          className="flex items-center gap-5 my-[22px] cursor-pointer"
                          key={i}
                          onClick={() => {
                            i === 0 && setRedDot(false);
                            toConversation(i);
                          }}
                        >
                          {item?.group?.name !== undefined ? (
                            <>
                              <img
                                src={groupAvatar}
                                alt="groupAvatar"
                                className="h-[40px]"
                              />
                              <div>
                                <div>
                                  <div className="flex items-center gap-10">
                                    <p className="font-bold text-[16px] text-primary_blue max-w-[70%]">
                                      {item?.group?.name}
                                    </p>
                                    <p className="text-[12px]">{item?.date}</p>
                                  </div>
                                  <div>
                                    <p className="font-bold text-[14px]">
                                      {item.name} :
                                    </p>
                                    <p className="text-[12px]">
                                      {item.lastChat}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="h-[40px] w-[40px] rounded-full bg-primary_blue mx-2 flex items-center justify-center">
                                <p className="font-bold text-white">
                                  {item?.name.split("")[0]}
                                </p>
                              </div>
                              <div>
                                <div>
                                  <div className="flex items-center gap-10">
                                    <p className="font-bold text-[16px] text-primary_blue max-w-[70%]">
                                      {item?.name}
                                    </p>
                                    <p className="text-[12px]">{item?.date}</p>
                                  </div>
                                  <div>
                                    <p className="font-bold text-[14px]">
                                      {item.name} :
                                    </p>
                                    <p className="text-[12px]">
                                      {item.lastChat}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        {i < groupData.length - 1 && <Divider />}
                      </div>
                    ))}
                  </section>
                ) : (
                  <div className="absolute left-1/2 -translate-x-1/2 top-[40%] flex flex-col gap-5">
                    <Spin
                      indicator={
                        <LoadingOutlined
                          style={{
                            fontSize: 40,
                          }}
                          spin
                        />
                      }
                    />
                    <p>Loading Chat...</p>
                  </div>
                )}{" "}
              </motion.div>
            </>
          ) : (
            <>
              {/* window */}
              <div className="w-[40%] h-[70%] bg-white bottom-[80px] right-5 absolute rounded py-[22px]">
                <div className="flex items-center justify-between px-[32px]">
                  <div className="flex items-center gap-3">
                    <ArrowLeftOutlined onClick={() => setMessageStage(1)} />
                    <div>
                      <p className="font-bold text-primary_blue">
                        {chatData.title}
                      </p>
                      {chatData.count > 1 && (
                        <p className="text-[12px]">
                          {chatData.count} Participants
                        </p>
                      )}
                    </div>
                  </div>
                  <CloseOutlined onClick={() => changeMenu("menu")} />
                </div>
                <Divider />
                <div
                  id="chatWindow"
                  className="px-[32px] h-[80%] overflow-auto"
                >
                  {chatData.chats.map((chat, x) => (
                    <div key={x}>
                      {chat.date !== "" && (
                        <div className="flex items-center mt-2">
                          <Divider>
                            <p>{chat.date}</p>
                          </Divider>
                        </div>
                      )}
                      <div>
                        {chat.chat.map((conv, i) =>
                          conv.name !== "You" ? (
                            <div key={i} className="flex flex-col items-start">
                              <p
                                className={`font-bold`}
                                style={{ color: conv.color.main }}
                              >
                                {conv.name}
                              </p>
                              <div
                                className={` p-2 rounded max-w-[70%] relative z-10`}
                                style={{ background: conv.color.sub }}
                              >
                                <div className="absolute right-0 top-0 translate-x-5 ">
                                  <EllipsisOutlined
                                    className="cursor-pointer"
                                    onClick={() =>
                                      handleAction(conv.name, conv.id)
                                    }
                                  />
                                  {actionOther === conv.id && (
                                    <ShareReply
                                      data={{ name: conv.name, msg: conv.text }}
                                    />
                                  )}
                                </div>
                                <p className="text-[12px]">{conv.text}</p>
                                <p className="text-[12px]">{conv.time}</p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div key={i} className="flex flex-col items-end">
                                <p
                                  className="font-bold"
                                  style={{ color: conv.color.main }}
                                >
                                  {conv.name}
                                </p>
                                {conv.replyTo.name !== "" && (
                                  <div className="bg-primary_white rounded-md mb-1 p-2 max-w-[70%]">
                                    <p className="text-[13px] font-bold">
                                      {conv.replyTo.name}
                                    </p>
                                    <p className="text-[12px]">
                                      {conv.replyTo.msg}
                                    </p>
                                  </div>
                                )}
                                <div
                                  className="p-2 rounded max-w-[70%] relative"
                                  style={{ background: conv.color.sub }}
                                >
                                  <div className="absolute left-0 top-0 -translate-x-5 ">
                                    <EllipsisOutlined
                                      className="cursor-pointer"
                                      onClick={() =>
                                        handleAction(conv.name, conv.id)
                                      }
                                    />
                                    {actionYou === conv.id && <EditDelete />}
                                  </div>

                                  <p className="text-[12px]">{conv.text}</p>
                                  <p className="text-[12px]">{conv.time}</p>
                                </div>
                              </div>
                            </>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {/* popup new message */}
                {statePopUpNewMessage && chatData.count > 1 && (
                  <div
                    className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#E9F3FF] py-2 px-3 rounded-md font-bold cursor-pointer"
                    onClick={() => scrollBottom()}
                  >
                    <p className="text-primary_blue">New Message</p>
                  </div>
                )}
                {/* popup waiting respond */}
                {loadingConnectTeam && chatData.count === 1 && (
                  <div className="absolute bottom-[75px] bg-[#E9F3FF] py-2 px-3 rounded-md font-bold cursor-pointer w-[70%] ml-[32px]">
                    <div className="text-primary_blue text-[12px] flex items-center gap-5">
                      <Spin
                        indicator={
                          <LoadingOutlined
                            style={{
                              fontSize: 14,
                            }}
                            spin
                          />
                        }
                      />
                      <p>
                        Please wait while we connect you with one of our team
                        ...
                      </p>
                    </div>
                  </div>
                )}
                {/* send new message */}
                <div className="px-[32px] h-12 w-full flex items-center gap-2">
                  <div className="w-full relative">
                    {reply.show && (
                      <div className="bg-primary_white w-full min-h-20 absolute bottom-0 z-50 -translate-y-10 rounded-md p-2">
                        <CloseOutlined
                          className="absolute right-1 top-1 cursor-pointer"
                          onClick={() =>
                            setReply({ show: false, replyTo: "", msg: "" })
                          }
                        />
                        <p className="text-[13px] font-bold">
                          Reply to {reply.replyTo}
                        </p>
                        <p className="text-[12px] pr-6">{reply.msg}</p>
                      </div>
                    )}
                    <input
                      type="text"
                      placeholder="Type a new message"
                      className={`border border-primary_light_gray rounded-md px-3 w-full py-1 outline-none`}
                      value={sendData}
                      onChange={(e) => setSendData(e.target.value)}
                    />
                  </div>
                  <Button
                    disabled={sendData === "" ? true : false}
                    type="primary"
                    onClick={() => handleSend()}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </>
          )}
        </>
      )}
      {toggleMenu === "task" && (
        <>
          <div>
            <Tooltip title="Back">
              <img
                src={taskIconActive}
                alt="task"
                onClick={() => changeMenu("menu")}
                className="h-[40px] cursor-pointer absolute bottom-5 right-5 z-[9]"
              />
            </Tooltip>
            <Tooltip title="Inbox">
              <img
                src={chatIcon}
                alt="chat"
                onClick={() => changeMenu("inbox")}
                className="h-[40px] cursor-pointer absolute bottom-5 right-[80px]"
              />
            </Tooltip>
          </div>
          {/* window */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 150,
              duration: 1,
            }}
            className="w-[40%] h-[70%] bg-white bottom-[80px] right-5 absolute rounded py-[22px] px-[32px]"
          >
            <Task />
          </motion.div>
        </>
      )}
    </>
  );
};

export default Menus;

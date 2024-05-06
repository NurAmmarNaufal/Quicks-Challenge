import React, { useEffect, useRef, useState } from "react";
import { Button, Dropdown, Divider, Checkbox, DatePicker, Spin } from "antd";
import TextareaAutosize from "react-textarea-autosize";
import {
  DownOutlined,
  EllipsisOutlined,
  ClockCircleOutlined,
  EditOutlined,
  LoadingOutlined,
  BookOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Tags from "./tag/Tags";
dayjs.extend(customParseFormat);

const Task = () => {
  const [editText, setEditText] = useState(-1);
  const [deleteState, setDeleteState] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");

  const items = [
    {
      key: 0,
      label: <p>Personal Errads</p>,
    },
    {
      key: 1,
      label: <p>Urgent To-Do</p>,
    },
  ];

  const [data, setData] = useState([
    {
      title: "Close off Case #012920- RODRIGUES, Amiguel",
      left: "2 Days Left",
      date: "12/06/2021",
      check: false,
      desc: "Closing off this case since this application has been cancelled. No one really understand how this case could possibly be cancelled. The options and the documents within this document were totally a guaranteed for a success!",
      stickers: [
        {
          value: "Important ASAP",
          color: "#E5F1FF",
        },
        {
          value: "Offline Meeting",
          color: "#FDCFA4",
        },
      ],
    },
    {
      title:
        "Set up documentation report for several Cases : Case 145443, Case 192829 and Case 182203",
      left: "4 Days Left",
      date: "14/06/2021",
      check: false,
      desc: "All Cases must include all payment transactions, all documents and forms filled. All conversations in comments and messages in channels and emails should be provided as well in.",
      stickers: [],
    },
    {
      title: "Set up appointment with Dr Blake",
      left: "10 Days Ledft",
      date: "20/06/2021",
      check: false,
      desc: "No Description",
      stickers: [],
    },
    {
      title: "Contact Mr Caleb - video conference?",
      left: "",
      date: "3/06/2021",
      check: true,
      desc: "No Description",
      stickers: [],
    },
    {
      title: "Assign 3 homework to Client A",
      left: "",
      date: "2/06/2021",
      check: true,
      desc: "No Description",
      stickers: [],
    },
  ]);

  const count = () => {
    let x = [];
    for (let i = 0; i < data.length; i++) {
      x.push(false);
    }
    return x;
  };
  const [accordion, setAccordion] = useState(count());

  const handleCheck = (e, index) => {
    const newData = [...data];
    newData[index].check = e.target.checked;
    setData(newData);
  };

  const handleSticker = (aha) => {
    setData(aha);
  };

  const handleNewTasks = () => {
    if (data[data.length - 1].title !== "") {
      setData([
        ...data,
        {
          title: "",
          left: "",
          date: "",
          check: false,
          desc: "No Description",
          stickers: [],
        },
      ]);

      setTimeout(() => {
        const targetDiv = document.getElementById("yoMan");
        if (targetDiv) {
          targetDiv.scrollTo({
            top: targetDiv.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  };

  const handleSaveTitle = (index) => {
    const newData = [...data];
    newData[index].title = newTitle;
    setData(newData);
    setNewTitle("");
  };

  const handleDeleteTask = (index) => {
    data.splice(index, 1);
    setDeleteState(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      {/* header */}
      <section className="flex items-center justify-between ml-14">
        <Dropdown
          menu={{
            items,
          }}
          placement="bottomLeft"
          arrow
        >
          <Button className="flex items-center">
            <span>My Task</span>
            <DownOutlined />
          </Button>
        </Dropdown>
        <Button
          type="primary"
          onClick={() => handleNewTasks()}
          disabled={data[data.length - 1].title === ""}
        >
          New Task
        </Button>
      </section>
      {/* content */}
      {!loading ? (
        <article
          id="yoMan"
          className="mt-[26px] overflow-auto relative h-[90%]"
        >
          {data.map((item, index) => (
            <div key={index}>
              <div className="flex items-baseline mr-3">
                <Checkbox
                  onChange={(e) => handleCheck(e, index)}
                  checked={item.check}
                />
                <div className="flex justify-between w-full ml-3">
                  {item.title !== "" ? (
                    <p
                      className={`text-[13px] font-bold max-w-[50%] ${
                        item.check && "line-through"
                      }`}
                    >
                      {item.title}
                    </p>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        placeholder="Type task title"
                        className="outline-none border p-1"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                      <Button
                        type="primary"
                        onClick={() => handleSaveTitle(index)}
                      >
                        Save
                      </Button>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <p className="text-[12px] text-red-500">{item.left}</p>
                    <p className="text-[12px]">{item.date}</p>
                    <DownOutlined
                      className={`cursor-pointer duration-500 ${
                        accordion[index] ? "rotate-180" : "rotate-0"
                      }`}
                      onClick={() => {
                        const newAccordion = [...accordion];
                        newAccordion[index] = !newAccordion[index];
                        setAccordion(newAccordion);
                      }}
                    />
                    <div>
                      <EllipsisOutlined
                        className="cursor-pointer"
                        onClick={() =>
                          deleteState !== index
                            ? setDeleteState(index)
                            : setDeleteState(-1)
                        }
                      />
                      {deleteState === index && (
                        <div
                          className="absolute right-3 border py-2 px-4 rounded-md hover:bg-red-50 cursor-pointer"
                          onClick={() => handleDeleteTask(index)}
                        >
                          <p className="text-red-500">Delete</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`grid overflow-hidden transition-all duration-500 ease-in-out ${
                  accordion[index] ? "grid-rows-[0fr] " : "grid-rows-[1fr]"
                } `}
              >
                <div className="overflow-hidden">
                  {/* date picker */}
                  <div className="ml-7 mt-3">
                    <ClockCircleOutlined className="text-primary_blue" />
                    <DatePicker
                      placeholder="Set Date"
                      defaultValue={
                        item.date === ""
                          ? ""
                          : dayjs(`${item.date}`, "DD/MM/YYYY")
                      }
                      format="DD/MM/YYYY"
                      allowClear={false}
                      className="ml-3"
                      onChange={(e, dateString) => {
                        const newData = [...data];
                        newData[index].date = dateString;
                        setData(newData);
                      }}
                    />
                  </div>
                  {/* desc */}
                  <div className="flex items-baseline ml-7 mt-3">
                    <EditOutlined className="text-primary_blue" />
                    {editText === index ? (
                      <TextareaAutosize
                        value={item.desc}
                        className="w-full h-full outline-none border ml-3 p-2"
                        onChange={(e) => {
                          const newData = [...data];
                          newData[index].desc = e.target.value;
                          setData(newData);
                        }}
                        onMouseLeave={() => setEditText(-1)}
                      />
                    ) : (
                      <p
                        className="w-full ml-3 cursor-pointer"
                        onClick={() => setEditText(index)}
                      >
                        {item.desc}
                      </p>
                    )}
                  </div>
                  {/* tags */}
                  <div className="ml-7 mt-3 mr-3 flex items-start">
                    <BookOutlined className="text-primary_blue" />
                    <div className="ml-3 w-full bg-primary_white rounded-md cursor-pointer">
                      <Tags
                        index={index}
                        data={data}
                        warna={item}
                        func={handleSticker}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Divider />
            </div>
          ))}
        </article>
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
          <p>Loading Task...</p>
        </div>
      )}
    </>
  );
};

export default Task;

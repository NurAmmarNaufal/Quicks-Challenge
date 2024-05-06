import React, { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";

const Tags = ({ index, data, warna, func }) => {
  const count = () => {
    let x = [];
    for (let i = 0; i <= index; i++) {
      x.push(false);
    }
    return x;
  };

  const [isOpen, setIsOpen] = useState(count());

  const options = [
    {
      value: "Important ASAP",
      color: "#E5F1FF",
    },
    {
      value: "Offline Meeting",
      color: "#FDCFA4",
    },
    {
      value: "Virtual Meeting",
      color: "#F9E9C3",
    },
    {
      value: "ASAP",
      color: "#AFEBDB",
    },
    {
      value: "Client Related",
      color: "#CBF1C2",
    },
    {
      value: "Self Task",
      color: "#CFCEF9",
    },
    {
      value: "Appointments",
      color: "#F9E0FD",
    },
    {
      value: "Court Related",
      color: "#9DD0ED",
    },
  ];

  const handleSelect = (value, color) => {
    // Cek apakah nilai sudah ada di dalam array
    if (data[index].stickers.some((item) => item.value === value)) {
      // Jika sudah ada, hapus objek dengan nilai tersebut dari array
      const updatedSelected = [...data];
      updatedSelected[index].stickers = updatedSelected[index].stickers.filter(
        (item) => item.value !== value
      );
      func(updatedSelected);
    } else {
      // Jika belum ada, tambahkan objek baru ke dalam array
      const updatedSelected = [...data];
      updatedSelected[index].stickers.push({ value: value, color: color });
      func(updatedSelected);
    }
  };

  return (
    <section>
      <div
        className="w-full min-h-5 m-2 flex flex-wrap gap-2"
        onClick={() => {
          const x = [...isOpen];
          x[index] = !isOpen[index];
          setIsOpen(x);
        }}
      >
        {
          warna.stickers.length > 0 ?
          warna.stickers.map((option, i) => (
          <div
            key={i}
            className={`p-1 my-1 rounded-md flex items-center gap-2`}
            style={{ background: `${option.color}` }}
          >
            <p className="pl-2">{option.value}</p>
            <CloseOutlined
              size={12}
              className="hover:bg-slate-300 p-1"
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(option.value);
              }}
            />
          </div>
        ))
        : (
          <p className="opacity-40">Pilis Status</p>
        )
        }
      </div>
      {isOpen[index] && (
        <div className="bg-white border rounded w-[50%] mt-2 absolute z-50 p-2">
          {options.map((option, i) => (
            <div
              key={i}
              className={`p-1 my-1 rounded-md ${
                warna.stickers.some((item) => item.value === option.value) &&
                "border-2 border-primary_blue"
              }`}
              style={{ background: `${option.color}` }}
              onClick={() => handleSelect(option.value, option.color)}
            >
              <p className="pl-2">{option.value}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Tags;

"use client";
import React, { use, useEffect, useState } from "react";
import HearderAdmin from "@/app/_components/HearderAdmin";
import Sidebar from "@/app/_components/Sidebar";
import {
  ArrowDownWideNarrow,
  Eye,
  Pen,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import Pagination from "@/app/_components/Pagination";
import Table from "@/app/_components/Table";
import {
  updateAircraftsFormFields,
  columnAircrafts,
  createAircraftsFormFields,
  filterAircraftsFormFields,
  sortAircraftFormFields,
} from "@/data/hardData.js";
import Link from "next/link";
import UpdateModal from "@/app/_components/UpdateModal";
import aircraftService from "@/lib/api/aircraft";
import CreateModal from "@/app/_components/CreateModal";
import FilterModal from "@/app/_components/FilterModal";
import SortModal from "@/app/_components/SortModal";
const page = () => {
  const [aircrafts, setAircrafts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [isCreate, setIsCreate] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [isSort, setIsSort] = useState(false);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const deleteAircraft = (item) => {
    Swal.fire({
      title: "Are you sure you want to delete?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await aircraftService.deleteAircraft(item.id);
        fetchData(currentPage, 10, query, sortBy, sortOrder);
      }
    });
  };

  const renderRow = (item) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-200"
    >
      <td className="font-sans">{item.id}</td>
      <td className="font-sans py-4">{item.name}</td>
      <td className="font-sans">{item.manufacturer}</td>
      <td>
        <div className="flex items-center gap-1">
          <Link href={`/admin/aircraft/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-200 cursor-pointer">
              <Eye className="w-[16px] h-[16px] text-white" />
            </button>
          </Link>
          <button
            className="w-7 h-7 flex items-center justify-center rounded-full bg-green-200 cursor-pointer"
            onClick={() => handleUpdate(item)}
          >
            <Pen className="w-[16px] h-[16px] text-white" />
          </button>
          <button
            className="w-7 h-7 flex items-center justify-center rounded-full bg-red-200 cursor-pointer"
            onClick={() => deleteAircraft(item)}
          >
            <X className="w-[16px] h-[16px] text-white" />
          </button>
        </div>
      </td>
    </tr>
  );
  const fetchData = async (
    currentPage = 1,
    pageSize = 10,
    query = "",
    sortBy = "id",
    sortOrder = "asc"
  ) => {
    try {
      const res = await aircraftService.getAircraftsBySearch(
        currentPage,
        pageSize,
        query.trim(),
        sortBy,
        sortOrder
      );
      setAircrafts(res?.data.aircrafts);
      setTotalPages(res?.data.totalPages);
    } catch (error) {
      console.error("Error fetch news:", error);
      setAircrafts([]);
    }
  };

  const handleSearch = () => {
    if (currentPage !== 1) setCurrentPage(1);
    else fetchData(1, 10, query, sortBy, sortOrder, sortBy, sortOrder);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = (item) => {
    setEditingItem(item);
  };

  const handleFilter = () => {
    setIsFilter(true);
  };
  const closeModal = () => {
    setEditingItem(null);
  };

  const closeCreateModal = () => {
    setIsCreate(false);
  };

  const handleCreate = () => {
    setIsCreate(true);
  };

  const closeFilterModal = () => {
    setIsFilter(false);
  };

  const closeSortModal = () => {
    setIsSort(false);
  };

  const handleSort = () => {
    setIsSort(true);
  };

  const submitCreate = async (createValues) => {
    await aircraftService.createNewAircraft(createValues);
    fetchData(currentPage, 10, query, sortBy, sortOrder);
    closeCreateModal();
  };

  const submitUpdate = async (updatedValues) => {
    const { id, name, manufacturer } = updatedValues;
    const updatedData = { name, manufacturer };
    await aircraftService.updateAircraft(id, updatedData);
    fetchData(currentPage, 10, query, sortBy, sortOrder);
    closeModal();
  };

  const submitSort = async (sortData) => {
    setSortBy(sortData.sortBy);
    setSortOrder(sortData.sortOrder);
    setCurrentPage(1);
    closeSortModal();
  };

  useEffect(() => {
    fetchData(currentPage, 10, query, sortBy, sortOrder);
  }, [currentPage, sortBy, sortOrder]);

  return (
    <div className="h-screen w-full flex">
      <Sidebar type="big" />
      <div className="flex-1">
        <HearderAdmin />
        <div className="p-5 flex flex-col items-center justify-between">
          <div className="w-full md:w-[80%] flex flex-row justify-between items-center font-medium">
            <p className="hidden md:block">All Aircrafts</p>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="w-full md:w-auto flex  items-center rounded-full border-[1.5px] border-gray-300 px-2">
                <Search
                  className={` ${
                    query.trim() === "" ? "text-gray-300" : ""
                  } cursor-pointer`}
                  onClick={handleSearch}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-[200px] p-2 bg-transparent outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-row items-center gap-2 justify-end">
                <button
                  className="flex flex-row items-center justify-center rounded-full bg-yellow-200 p-2 cursor-pointer"
                  onClick={handleFilter}
                >
                  <SlidersHorizontal className="w-[14px] h-[14px]" />
                </button>
                <button
                  className="flex flex-row items-center justify-center rounded-full bg-yellow-200 p-2 cursor-pointer"
                  onClick={handleSort}
                >
                  <ArrowDownWideNarrow className="w-[14px] h-[14px]" />
                </button>
                <button className="flex flex-row items-center justify-center rounded-full bg-yellow-200 p-2 cursor-pointer">
                  <Plus
                    className="w-[14px] h-[14px]"
                    onClick={() => handleCreate()}
                  />
                </button>
              </div>
            </div>
          </div>
          <Table
            columns={columnAircrafts}
            renderRow={renderRow}
            data={aircrafts}
          />

          {editingItem && (
            <UpdateModal
              key="update-modal"
              item={editingItem}
              onClose={closeModal}
              onSubmit={submitUpdate}
              updateFormFields={updateAircraftsFormFields}
              type="Aircraft"
            />
          )}
          {isCreate && (
            <CreateModal
              key="create-modal"
              onClose={closeCreateModal}
              onSubmit={submitCreate}
              createFormFields={createAircraftsFormFields}
              type="Aircraft"
            />
          )}
          {isFilter && (
            <FilterModal
              key="filter-modal"
              onClose={closeFilterModal}
              fields={filterAircraftsFormFields}
              type="aircraft"
            />
          )}
          {isSort && (
            <SortModal
              onClose={closeSortModal}
              sortBy={sortBy}
              sortOrder={sortOrder}
              type={"flight"}
              onSubmit={submitSort}
              sortFormFields={sortAircraftFormFields}
            />
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default page;

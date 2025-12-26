import HeaderBar from "../../../../../components/common/HeaderBar.tsx";
import {useState} from "react";
import {useGetProblemsQuery} from "../../../../../services/problem/problem.service.ts";
import TestCaseTable from "./components/TestCaseTable.tsx";
import type {ITestCase} from "../../../../../types/problem.types.ts";
import AddTestCaseModal from "./components/AddTestCaseModal.tsx";
import EditTestCaseModal from "./components/EditTestCaseModal.tsx";

const TestCasePage = () => {
    const [selectedTestCaseId, setSelectedTestCaseId] = useState<number>(0);
    const [isTestCaseAddOpen, setIsTestCaseAddOpen] = useState<boolean>(false);
    const [isTestCaseEditOpen, setIsTestCaseEditOpen] = useState<boolean>(false);
    const {data, isLoading} = useGetProblemsQuery()
    const problems = data?.items || [];

    const handleEditTestCase = (testCase: ITestCase) => {
        setSelectedTestCaseId(testCase.test_case_id)
        setIsTestCaseEditOpen(true)
    }

    return (
        <div className="flex-1 overflow-auto px-10 pb-10 z-10">
            <HeaderBar title={"Quản lý test case"} buttonText={"Thêm test case"} setOpen={() => setIsTestCaseAddOpen(true)} />
            <TestCaseTable onEdit={handleEditTestCase} problems={problems} loading={isLoading} />

            <AddTestCaseModal problems={problems} isOpen={isTestCaseAddOpen} onClose={() => setIsTestCaseAddOpen(false)} />
            <EditTestCaseModal
                isOpen={isTestCaseEditOpen}
                onClose={() => setIsTestCaseEditOpen(false)}
                problems={problems}
                testCaseId={selectedTestCaseId}/>
        </div>
    )
}

export default TestCasePage
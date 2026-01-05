import { Box, TextField, Typography } from '@mui/material'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'


type TreeViewType = {
    data: nodeType[],
    selectedCodepaths: string[],
    setSelectedCodepaths: Dispatch<SetStateAction<string[]>>,
}

type nodeType = {
    organizationParentId: string | null,
    id:string,
    name:string,
    codePath:string
}


const TreeView: React.FC<TreeViewType> = ({ data, selectedCodepaths, setSelectedCodepaths }) => {
    const [textFilter, setTextFilter] = useState("")
    const [treeComponent, setTreeComponent] = useState(<></>)
    const [dataTree, setDataTree] = useState(undefined)

    const recursiveCreateTree : any = (node: nodeType, nodeList: any) => {
        let children = nodeList.filter((element: nodeType)=> element.organizationParentId === node.id)

        let childrenData = []
        for(let child of children){
            const childData = recursiveCreateTree(
                child, 
                nodeList
            )
            childrenData.push(childData)
        }

        return {...node, subs:childrenData}
    }

    const createTree = (nodeList: nodeType[]) => {
        const rootElement: any = nodeList.find((elm: any) => elm.organizationParentId === null)
        const newDataTree = recursiveCreateTree(
            rootElement, 
            nodeList, 
        )
        return newDataTree
    }

    useEffect(() => {
      const newDataTree = createTree(data)
      setDataTree(newDataTree)
    }, [])
    
    const createTreeComponent = (branch: any, isFatherSelected: boolean) => {
        return (
            <TreeItem
                key={branch?.id}
                itemId={branch?.codePath}
                label={branch?.name}
                disabled={isFatherSelected}
            >
                {branch?.subs?.map((child:any) => createTreeComponent(child, isFatherSelected || selectedCodepaths.includes(branch.codePath)))}
            </TreeItem>
        )
    }

    const recursivelySelectCodepaths = (node: any, selectedIds: Array<string>, isSelected: boolean) => {
        isSelected = isSelected || selectedIds.includes(node.codePath)
        let newSelected : Array<string> = isSelected ? [node.codePath] : []
        for(let child of node.subs){
            newSelected = newSelected.concat(recursivelySelectCodepaths(child, selectedIds, isSelected))
        }
        return newSelected
    }

    const changeTreeHandler = (args: any, selectedIds: Array<string>) => {
        let newSelectedIds = recursivelySelectCodepaths(dataTree, selectedIds, false)

        setSelectedCodepaths(newSelectedIds)
    }

    const recursiveFilterTree: any = (data: any) => {
        if (textFilter.length === 0) {
            return { isContaining: true, data: data }
        }

        let newDataTree = []
        let itContains = false

        for (let index = 0; index < data?.subs?.length; index++) {
            const { isContaining, data: childData } = recursiveFilterTree(data?.subs[index])
            if (isContaining) {
                newDataTree.push(childData)
                itContains = true
            } else if (data?.subs[index].name.includes(textFilter)) {
                newDataTree.push({
                    ...childData,
                    subs: []
                })
                itContains = true
            }
        }
        return { 
            isContaining: itContains, 
            data: {
                ...data,
                subs: newDataTree
            } 
        }
    }

    return (
        <Box sx={{ width: "100%" }}>
            <TextField sx={{ width: "100%" }} label="جستجو‌ی یگان" onChange={e => setTextFilter(e.target.value)} />
            <Box sx={{ border: "solid grey", borderWidth: "0px 1px 1px 1px", maxHeight:"450px", overflow:"auto" }}>
                <SimpleTreeView multiSelect
                    checkboxSelection
                    selectedItems={selectedCodepaths}
                    onSelectedItemsChange={changeTreeHandler}>
                        {createTreeComponent(recursiveFilterTree(dataTree).data, false)}
                    </SimpleTreeView>
            </Box>
        </Box>
    )
}

export default TreeView;
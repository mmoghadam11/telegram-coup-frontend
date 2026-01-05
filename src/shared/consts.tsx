import {Typography} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import {RightMenuLinkKeysEnum} from "./enums/RightMenuLinkKeysEnum";
import {
    CommandMenuKeysType,
    CommandMenuPostfixKey,
    ExtractMenuKeysType,
    ExtractMenuPostfixKey,
    FilterMenuKeys,
    MenuKeyPrefixType,
    MenuKeyType,
    OrderMenuKeysType, QueryMenuKeysType, QueryMenuPostfixKey,
    WorkflowMenuKeysType,
    WorkflowMenuPostfixKey
} from "../types/rightMenuTypes";
import {RightMenuPrefixKeysEnum} from "./enums/RightMenuPrefixKeysEnum";

import {PayCheckOwnerEnum} from './enums/PayCheckOwnerEnum'

export const BOOLEAN_SELECT = [
    {title: "بله", value: true},
    {title: "خیر", value: false},
];
export const STATUS_SELECT = [
    {
        title: (
            <Typography component="span" sx={{display: "flex", alignItems: "center"}}>
                <CheckCircleOutlineOutlinedIcon color="success" sx={{mr: 1}}/>
                فعال
            </Typography>
        ),
        value: true,
    },
    {
        title: (
            <Typography component="span" sx={{display: "flex", alignItems: "center"}}>
                <BlockIcon color="error" sx={{mr: 1}}/>
                غیر فعال
            </Typography>
        ),
        value: false,
    },
];

export const UNLIMITED_QUERY_PARAM = "currentPage=1&pageSize=1000";

export const orderKeys: Array<FilterMenuKeys> = [
    "TODO",
    "REFERRED",
    "ACCEPTED",
    "AWAITING_PUBLICATION",
    "PUBLISHED",
    "RETURNED",
    "ALL"
];
export const commandKeys: Array<CommandMenuPostfixKey> = [
    "TODO",
    "REFERRED",
    "ACCEPTED",
    "PUBLISHED",
    "RETURNED",
    "ALL"
];

export const workflowKeys: Array<WorkflowMenuPostfixKey> = [
    "TODO",
    "RETURNED",
    "REFERRED",
    "ACCEPTED",
    "RETURNED_FROM_LEGAL_FILE",
    "ALL",
    "SENT"
];

export const extractKeys: Array<ExtractMenuPostfixKey> = [
    "GROUP",
    "PERSONAL",
    "BORHAN_PERSONAL"
];

export const queryKeys: Array<QueryMenuPostfixKey> = [
    "TODO",
    "ANSWERED",
    "ALL",
];

export const rightMenuKeyTitles: {
    [key in RightMenuLinkKeysEnum]: string
} = {
    [RightMenuLinkKeysEnum.TODO]: 'جهت اقدام',
    [RightMenuLinkKeysEnum.REFERRED]: 'ارجاع شده',
    [RightMenuLinkKeysEnum.ACCEPTED]: 'تایید شده',
    [RightMenuLinkKeysEnum.AWAITING_PUBLICATION]: 'در انتظار انتشار',
    [RightMenuLinkKeysEnum.PUBLISHED]: 'منتشر شده',
    [RightMenuLinkKeysEnum.RETURNED]: 'برگشت داده شده',
    [RightMenuLinkKeysEnum.ALL]: 'همه',
    [RightMenuLinkKeysEnum.RETURNED_FROM_LEGAL_FILE]: 'برگشت شده از فایل حقوقی',
    [RightMenuLinkKeysEnum.SENT]: 'ارسال شده',
    [RightMenuLinkKeysEnum.GROUP]: 'مستخرجه گروهی',
    [RightMenuLinkKeysEnum.PERSONAL]: 'مستخرجه فردی کلی',
    [RightMenuLinkKeysEnum.BORHAN_PERSONAL]: 'مستخرجه فردی برهان',
    [RightMenuLinkKeysEnum.ANSWERED]: 'پاسخ داده شده',
}

export const orderMenuKeyTitles: {
    [key in OrderMenuKeysType]?: string
} = {
    ORDER_TODO: rightMenuKeyTitles.TODO,
    ORDER_REFERRED: rightMenuKeyTitles.REFERRED,
    ORDER_ACCEPTED: rightMenuKeyTitles.ACCEPTED,
    ORDER_AWAITING_PUBLICATION: rightMenuKeyTitles.AWAITING_PUBLICATION,
    ORDER_PUBLISHED: rightMenuKeyTitles.PUBLISHED,
    ORDER_RETURNED: rightMenuKeyTitles.RETURNED,
    ORDER_ALL: rightMenuKeyTitles.ALL,
}

export const commandMenuKeyTitles: {
    [key in CommandMenuKeysType]?: string
} = {
    COMMAND_TODO: rightMenuKeyTitles.TODO,
    COMMAND_REFERRED: rightMenuKeyTitles.REFERRED,
    COMMAND_ACCEPTED: rightMenuKeyTitles.ACCEPTED,
    COMMAND_PUBLISHED: rightMenuKeyTitles.PUBLISHED,
    COMMAND_RETURNED: rightMenuKeyTitles.RETURNED,
    COMMAND_ALL: rightMenuKeyTitles.ALL,
}

export const workflowMenuKeyTitles: {
    [key in WorkflowMenuKeysType]?: string
} = {
    WORKFLOW_TODO: rightMenuKeyTitles.TODO,
    WORKFLOW_REFERRED: rightMenuKeyTitles.REFERRED,
    WORKFLOW_ACCEPTED: rightMenuKeyTitles.ACCEPTED,
    WORKFLOW_RETURNED: rightMenuKeyTitles.RETURNED,
    WORKFLOW_ALL: rightMenuKeyTitles.ALL,
    WORKFLOW_RETURNED_FROM_LEGAL_FILE: rightMenuKeyTitles.RETURNED_FROM_LEGAL_FILE,
    WORKFLOW_SENT: rightMenuKeyTitles.SENT,
}

export const extractMenuKeyTitles: {
    [key in ExtractMenuKeysType]?: string
} = {
    EXTRACT_GROUP: rightMenuKeyTitles.GROUP,
    EXTRACT_PERSONAL: rightMenuKeyTitles.PERSONAL,
    EXTRACT_BORHAN_PERSONAL: rightMenuKeyTitles.BORHAN_PERSONAL,
}

export const queryMenuKeyTitles: {
    [key in QueryMenuKeysType]?: string
} = {
    QUERY_TODO: rightMenuKeyTitles.TODO,
    QUERY_ANSWERED: rightMenuKeyTitles.ANSWERED,
    QUERY_ALL: rightMenuKeyTitles.ALL,
}

export const allMenuPrefixes: Array<MenuKeyPrefixType> = Object.keys(RightMenuPrefixKeysEnum)
    .map(prefixKey => (`${prefixKey}_` as MenuKeyPrefixType));

export const allMenuKeys: Array<any> = Array.from(new Set([
    ...orderKeys.map(key => `ORDER_${key}`),
    ...commandKeys.map(key => `COMMAND_${key}`),
    ...workflowKeys.map(key => `WORKFLOW_${key}`),
    ...extractKeys.map(key => `EXTRACT_${key}`),
    ...queryKeys.map(key => `QUERY_${key}`),
]))

export const menuLinks: {
    [key in MenuKeyType]?: string
} = {
    ORDER_TODO: `order/${RightMenuLinkKeysEnum.TODO}`,
    ORDER_REFERRED: `order/${RightMenuLinkKeysEnum.REFERRED}`,
    ORDER_ACCEPTED: `order/${RightMenuLinkKeysEnum.ACCEPTED}`,
    ORDER_AWAITING_PUBLICATION: `order/${RightMenuLinkKeysEnum.AWAITING_PUBLICATION}`,
    ORDER_PUBLISHED: `order/${RightMenuLinkKeysEnum.PUBLISHED}`,
    ORDER_RETURNED: `order/${RightMenuLinkKeysEnum.RETURNED}`,
    ORDER_ALL: `order/${RightMenuLinkKeysEnum.ALL}`,

    COMMAND_TODO: `command/${RightMenuLinkKeysEnum.TODO}`,
    COMMAND_REFERRED: `command/${RightMenuLinkKeysEnum.REFERRED}`,
    COMMAND_ACCEPTED: `command/${RightMenuLinkKeysEnum.ACCEPTED}`,
    COMMAND_PUBLISHED: `command/${RightMenuLinkKeysEnum.PUBLISHED}`,
    COMMAND_RETURNED: `command/${RightMenuLinkKeysEnum.RETURNED}`,
    COMMAND_ALL: `command/${RightMenuLinkKeysEnum.ALL}`,

    WORKFLOW_TODO: `workflow/${RightMenuLinkKeysEnum.TODO}`,
    WORKFLOW_RETURNED: `workflow/${RightMenuLinkKeysEnum.RETURNED}`,
    WORKFLOW_REFERRED: `workflow/${RightMenuLinkKeysEnum.REFERRED}`,
    WORKFLOW_ACCEPTED: `workflow/${RightMenuLinkKeysEnum.ACCEPTED}`,
    WORKFLOW_RETURNED_FROM_LEGAL_FILE: `workflow/${RightMenuLinkKeysEnum.RETURNED_FROM_LEGAL_FILE}`,
    WORKFLOW_ALL: `workflow/${RightMenuLinkKeysEnum.ALL}`,
    WORKFLOW_SENT: `workflow/${RightMenuLinkKeysEnum.SENT}`,

    EXTRACT_GROUP: `extract/${RightMenuLinkKeysEnum.GROUP}`,
    EXTRACT_PERSONAL: `extract/${RightMenuLinkKeysEnum.PERSONAL}`,
    EXTRACT_BORHAN_PERSONAL: `extract/${RightMenuLinkKeysEnum.BORHAN_PERSONAL}`,

    QUERY_TODO: `query/${RightMenuLinkKeysEnum.TODO}`,
    QUERY_ANSWERED: `query/${RightMenuLinkKeysEnum.ANSWERED}`,
    QUERY_ALL: `query/${RightMenuLinkKeysEnum.ALL}`,

}

/*console.log("=========== START ============")
console.log(allMenuKeys);
allMenuKeys.map(key => {
    console.log("-----------------------------")
    console.log(key);
    console.log(allMenuPrefixes.map(pref => (key.replace(pref, ''))))
    console.log("-----------------------------")
})
console.log("============ END =============")*/

// export const allMenuTitles: {
//     [key in MenuKeyType]: string
// } = {
//     ...allMenuKeys.map(key => {
//         const all = allMenuPrefixes;
//         console.log(all);
//     } /*({
//         [key]: rightMenuKeyTitles[key.replace(, '') as RightMenuLinkKeysEnum]
//     })*/).entries()
// }

// console.log(allMenuTitles);


export const listOfPayCheckOwnerOptions = Object.values(PayCheckOwnerEnum);

export const PayCheckOwnerTitles: {
    [values in PayCheckOwnerEnum]: string
} = {
    [PayCheckOwnerEnum.USER]: "کاربر",
    [PayCheckOwnerEnum.PERSONEL]: "پرسنل"
}

export const PersonnelNumberFetchStateEnum = {
    LOADING: "در حال شناسایی شماره پرسنلی...",
    ERROR: "دسترسی به پرسنل داده شده وجود ندارد."
}
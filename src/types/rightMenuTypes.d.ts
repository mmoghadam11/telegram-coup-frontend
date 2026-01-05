import {RightMenuLinkKeysEnum} from "../shared/enums/RightMenuLinkKeysEnum";
import {RightMenuPrefixKeysEnum} from "../shared/enums/RightMenuPrefixKeysEnum";

export type createMenuKey = ({menuKey, RightMenuLinkKeysEnum}) => MenuKeyType;

export type OrderMenuPostfixKey = keyof typeof RightMenuLinkKeysEnum;

export type FilterMenuKeys = Exclude<OrderMenuPostfixKey, RightMenuLinkKeysEnum.GROUP | RightMenuLinkKeysEnum.PERSONAL | RightMenuLinkKeysEnum.BORHAN_PERSONAL>;

export type MenuKeyPrefixType = `${keyof typeof RightMenuPrefixKeysEnum}_`;

export type MenuKeyType = `${MenuKeyPrefixType}${keyof typeof RightMenuLinkKeysEnum}`;

export type OrderMenuKeysType = `${RightMenuPrefixKeysEnum.ORDER}_${Exclude<FilterMenuKeys, 'RETURNED_FROM_LEGAL_FILE' | 'SENT'>}`;

export type CommandMenuPostfixKey = Exclude<FilterMenuKeys, RightMenuLinkKeysEnum.AWAITING_PUBLICATION | RightMenuLinkKeysEnum.RETURNED_FROM_LEGAL_FILE | RightMenuLinkKeysEnum.SENT>;

export type CommandMenuKeysType = `${RightMenuPrefixKeysEnum.COMMAND}_${CommandMenuPostfixKey}`;

export type WorkflowMenuPostfixKey = Exclude<FilterMenuKeys, 'AWAITING_PUBLICATION' | 'PUBLISHED'>;

export type WorkflowMenuKeysType = `${RightMenuPrefixKeysEnum.WORKFLOW}_${WorkflowMenuPostfixKey}`;

export type ExtractMenuPostfixKey = Extract<OrderMenuPostfixKey, 'GROUP' | 'PERSONAL' | 'BORHAN_PERSONAL'>;

export type ExtractMenuKeysType = `${RightMenuPrefixKeysEnum.EXTRACT}_${ExtractMenuPostfixKey}`;

export type QueryMenuPostfixKey = Extract<FilterMenuKeys, 'TODO' | 'ANSWERED' | 'ALL'>;

export type QueryMenuKeysType = `${RightMenuPrefixKeysEnum.QUERY}_${QueryMenuPostfixKey}`;

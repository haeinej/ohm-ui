"use client";

import { memo, useEffect } from "react";
import { useAui } from "@assistant-ui/react";
import {
  ModelSelectorRoot,
  ModelSelectorTrigger,
  ModelSelectorValue,
  ModelSelectorContent,
  ModelSelectorSearch,
  ModelSelectorFocusAnchor,
  ModelSelectorList,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorSeparator,
  ModelSelectorItem,
  ModelSelectorEffort,
  useModelSelectorContext,
  type ModelSelectorProps,
} from "@/registry/ohm/assistant/elements-model-selector";

import { DEFAULT_EFFORT_OPTIONS as __reexport_DEFAULT_EFFORT_OPTIONS, modelSelectorTriggerVariants as __reexport_modelSelectorTriggerVariants, resolveModelEffort as __reexport_resolveModelEffort, useModelSelectorEfforts as __reexport_useModelSelectorEfforts, ModelSelectorRoot as __reexport_ModelSelectorRoot, ModelSelectorTrigger as __reexport_ModelSelectorTrigger, ModelSelectorValue as __reexport_ModelSelectorValue, ModelSelectorContent as __reexport_ModelSelectorContent, ModelSelectorSearch as __reexport_ModelSelectorSearch, ModelSelectorFocusAnchor as __reexport_ModelSelectorFocusAnchor, ModelSelectorList as __reexport_ModelSelectorList, ModelSelectorEmpty as __reexport_ModelSelectorEmpty, ModelSelectorGroup as __reexport_ModelSelectorGroup, ModelSelectorSeparator as __reexport_ModelSelectorSeparator, ModelSelectorItem as __reexport_ModelSelectorItem, ModelSelectorEffort as __reexport_ModelSelectorEffort } from "@/registry/ohm/assistant/elements-model-selector";
export { __reexport_DEFAULT_EFFORT_OPTIONS as DEFAULT_EFFORT_OPTIONS, __reexport_modelSelectorTriggerVariants as modelSelectorTriggerVariants, __reexport_resolveModelEffort as resolveModelEffort, __reexport_useModelSelectorEfforts as useModelSelectorEfforts, __reexport_ModelSelectorRoot as ModelSelectorRoot, __reexport_ModelSelectorTrigger as ModelSelectorTrigger, __reexport_ModelSelectorValue as ModelSelectorValue, __reexport_ModelSelectorContent as ModelSelectorContent, __reexport_ModelSelectorSearch as ModelSelectorSearch, __reexport_ModelSelectorFocusAnchor as ModelSelectorFocusAnchor, __reexport_ModelSelectorList as ModelSelectorList, __reexport_ModelSelectorEmpty as ModelSelectorEmpty, __reexport_ModelSelectorGroup as ModelSelectorGroup, __reexport_ModelSelectorSeparator as ModelSelectorSeparator, __reexport_ModelSelectorItem as ModelSelectorItem, __reexport_ModelSelectorEffort as ModelSelectorEffort };

import type { ModelOption as __reexport_ModelOption, ModelSelectorEffortOption as __reexport_ModelSelectorEffortOption, ModelSelectorProps as __reexport_ModelSelectorProps, ModelSelectorRootProps as __reexport_ModelSelectorRootProps, ModelSelectorTriggerProps as __reexport_ModelSelectorTriggerProps, ModelSelectorValueProps as __reexport_ModelSelectorValueProps, ModelSelectorContentProps as __reexport_ModelSelectorContentProps, ModelSelectorSearchProps as __reexport_ModelSelectorSearchProps, ModelSelectorListProps as __reexport_ModelSelectorListProps, ModelSelectorEmptyProps as __reexport_ModelSelectorEmptyProps, ModelSelectorGroupProps as __reexport_ModelSelectorGroupProps, ModelSelectorSeparatorProps as __reexport_ModelSelectorSeparatorProps, ModelSelectorItemProps as __reexport_ModelSelectorItemProps, ModelSelectorEffortProps as __reexport_ModelSelectorEffortProps } from "@/registry/ohm/assistant/elements-model-selector";
export type { __reexport_ModelOption as ModelOption, __reexport_ModelSelectorEffortOption as ModelSelectorEffortOption, __reexport_ModelSelectorProps as ModelSelectorProps, __reexport_ModelSelectorRootProps as ModelSelectorRootProps, __reexport_ModelSelectorTriggerProps as ModelSelectorTriggerProps, __reexport_ModelSelectorValueProps as ModelSelectorValueProps, __reexport_ModelSelectorContentProps as ModelSelectorContentProps, __reexport_ModelSelectorSearchProps as ModelSelectorSearchProps, __reexport_ModelSelectorListProps as ModelSelectorListProps, __reexport_ModelSelectorEmptyProps as ModelSelectorEmptyProps, __reexport_ModelSelectorGroupProps as ModelSelectorGroupProps, __reexport_ModelSelectorSeparatorProps as ModelSelectorSeparatorProps, __reexport_ModelSelectorItemProps as ModelSelectorItemProps, __reexport_ModelSelectorEffortProps as ModelSelectorEffortProps };

/** Registers the selection with assistant-ui's ModelContext system. The
 * context's effort is already resolved against the selected model. */
function ModelSelectorModelContext() {
  const { value, effort } = useModelSelectorContext();
  const api = useAui();

  useEffect(() => {
    if (value === undefined) return;
    const config = {
      config: {
        modelName: value,
        ...(effort !== undefined ? { reasoningEffort: effort } : undefined),
      },
    };
    return api.modelContext.register({
      getModelContext: () => config,
    });
  }, [api, value, effort]);

  return null;
}

const ModelSelectorImpl = ({
  searchable,
  variant,
  size,
  align,
  className,
  contentClassName,
  ...rootProps
}: ModelSelectorProps) => {
  return (
    <ModelSelectorRoot {...rootProps}>
      <ModelSelectorModelContext />
      <ModelSelectorTrigger
        variant={variant}
        size={size}
        className={className}
      />
      <ModelSelectorContent
        {...(align !== undefined ? { align } : {})}
        className={contentClassName}
        searchable={searchable ?? false}
      />
    </ModelSelectorRoot>
  );
};

type ModelSelectorComponent = typeof ModelSelectorImpl & {
  displayName?: string;
  Root: typeof ModelSelectorRoot;
  Trigger: typeof ModelSelectorTrigger;
  Value: typeof ModelSelectorValue;
  Content: typeof ModelSelectorContent;
  Search: typeof ModelSelectorSearch;
  FocusAnchor: typeof ModelSelectorFocusAnchor;
  List: typeof ModelSelectorList;
  Empty: typeof ModelSelectorEmpty;
  Group: typeof ModelSelectorGroup;
  Separator: typeof ModelSelectorSeparator;
  Item: typeof ModelSelectorItem;
  Effort: typeof ModelSelectorEffort;
};

const ModelSelector = memo(
  ModelSelectorImpl,
) as unknown as ModelSelectorComponent;

ModelSelector.displayName = "ModelSelector";
ModelSelector.Root = ModelSelectorRoot;
ModelSelector.Trigger = ModelSelectorTrigger;
ModelSelector.Value = ModelSelectorValue;
ModelSelector.Content = ModelSelectorContent;
ModelSelector.Search = ModelSelectorSearch;
ModelSelector.FocusAnchor = ModelSelectorFocusAnchor;
ModelSelector.List = ModelSelectorList;
ModelSelector.Empty = ModelSelectorEmpty;
ModelSelector.Group = ModelSelectorGroup;
ModelSelector.Separator = ModelSelectorSeparator;
ModelSelector.Item = ModelSelectorItem;
ModelSelector.Effort = ModelSelectorEffort;

export { ModelSelector };

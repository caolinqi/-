
import { useI18n } from 'vue-i18n';

export function useLocalized() {
    const { locale, t } = useI18n();

    /**
     * 获取对象的本地化字段值
     * @param obj 数据对象
     * @param field 基础字段名 (e.g., 'name', 'description')
     * @returns 本地化后的字符串
     */
    const getLocalized = (obj: any, field: string): string => {
        if (!obj) return '';

        // 检查是否有对应的语言字段
        if (locale.value === 'en-US') {
            return obj[`${field}En`] || obj[field] || '';
        }

        if (locale.value === 'ja-JP') {
            // Unordered fallback: Ja -> En -> Zh (Default)
            return obj[`${field}Ja`] || obj[`${field}En`] || obj[field] || '';
        }

        // 默认为中文 (基础字段)
        return obj[field] || '';
    };

    /**
     * 获取本地化的标签文本
     * @param tag 标签原始值
     * @returns 翻译后的标签
     */
    const getLocalizedTag = (tag: string): string => {
        return t(`tags.${tag}`, tag); // fallback to tag itself
    };

    return {
        getLocalized,
        getLocalizedTag,
        locale // 暴露 locale 以便在需要时做特定判断
    };
}

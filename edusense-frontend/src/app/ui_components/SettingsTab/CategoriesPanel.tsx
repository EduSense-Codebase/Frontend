import React, { useState, useEffect } from 'react';
import { httpPost, httpGet } from '@/app/utils';
import { useParams } from 'next/navigation';
import { API_PREFIX, COURSE_ENDPOINT } from '@/app/global';
import Button from '../Button';
import { toast } from 'react-hot-toast';

import { CategoryResponse, ICategory } from '@/app/typedef';
const MAX_WEIGHT = 100;

const CategoriesPanel: React.FC = () => {
    const params = useParams();
    const enrollmentId = params.enrollmentId as string;

    const [categories, setCategories] = useState<ICategory[]>([]);
    const [newCategoryName, setNewCategoryName] = useState<string>('');
    const [newCategoryWeight, setNewCategoryWeight] = useState<number | ''>('');
    const [loading, setLoading] = useState(true);

    const totalWeight = categories.reduce((s, c) => s + Number(c.weight || 0), 0);

    // Load categories on mount
    useEffect(() => {
        const url = API_PREFIX + COURSE_ENDPOINT;
        const queryParams = { section: 'get_categories', course_id: enrollmentId };
        httpGet<CategoryResponse>(url, queryParams).then((res) => {
            console.log('categories', res.data);
            if (res.data) {
                const catArray = Object.entries(res.data.data).map(([name, weight]) => ({
                    name,
                    weight,
                }));
                setCategories(catArray);
            }
            setLoading(false);
        });
    }, [enrollmentId]);

    const handleCategoryNameChange = (index: number, name: string) =>
        setCategories((prev) => prev.map((c, i) => (i === index ? { ...c, name } : c)));

    const handleCategoryWeightChange = (index: number, weight: number) =>
        setCategories((prev) => prev.map((c, i) => (i === index ? { ...c, weight } : c)));

    const addCategory = () => {
        if (!newCategoryName.trim()) {
            toast.error('Please enter a category name.');
            return;
        }
        const weightNumber = Number(newCategoryWeight);
        const totalCurrentWeight = categories.reduce(
            (sum, cat) => sum + Number(cat.weight || 0),
            0,
        );
        if (isNaN(weightNumber) || weightNumber <= 0) {
            toast.error('Please enter a valid weight');
            return;
        }

        if (weightNumber + totalCurrentWeight > MAX_WEIGHT) {
            toast.error('Exceeding max weight');
            return;
        }
        const newCat: ICategory = {
            name: newCategoryName.trim(),
            weight: weightNumber,
        };
        setCategories((prev) => [...prev, newCat]);
        setNewCategoryName('');
        setNewCategoryWeight('');
    };

    const removeCategory = (index: number) =>
        setCategories((prev) => prev.filter((_, i) => i !== index));

    const saveCategories = () => {
        const url = API_PREFIX + COURSE_ENDPOINT;
        const catDict = categories.reduce<Record<string, number>>((acc, c) => {
            if (c.name.trim()) acc[c.name] = c.weight;
            return acc;
        }, {});
        const payload = {
            course_id: enrollmentId,
            categories: JSON.stringify(catDict),
        };
        console.log('this is what is being sent back', payload);
        const queryParams = {
            section: 'add_categories_and_weights',
        };

        if (totalWeight != 100) {
            console.log('weights do not add up.');
            return;
        }

        httpPost(url, payload, queryParams).then((res) => {
            console.log('Saved categories:', res);
            toast.success('Categories saved!');
        });
    };

    if (loading) return <p>Loading categories...</p>;

    return (
        <div className="panel">
            <h3>Categories & Weights</h3>

            <div className="category-list">
                {categories.map((cat, index) => (
                    <div key={index} className="category-item">
                        <input
                            className="cat-name"
                            data-testid={`cat-added-name-${index}`}
                            value={cat.name}
                            onChange={(e) => handleCategoryNameChange(index, e.target.value)}
                        />
                        <div className="weight-wrap">
                            <input
                                className="weight-input"
                                data-testid={`cat-added-weight-${index}`}
                                type="number"
                                value={cat.weight}
                                min={0}
                                max={100}
                                onChange={(e) =>
                                    handleCategoryWeightChange(index, Number(e.target.value || 0))
                                }
                            />
                            <span className="percent">%</span>
                        </div>
                        <button
                            className="btn btn-ghost remove-btn"
                            onClick={() => removeCategory(index)}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            <div className="add-row">
                <input
                    className="add-name"
                    data-testid="cat-name"
                    placeholder="New category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <div className="add-weight">
                    <input
                        className="weight-input"
                        data-testid="cat-weight"
                        type="number"
                        placeholder="0"
                        value={newCategoryWeight === '' ? '' : String(newCategoryWeight)}
                        onChange={(e) =>
                            setNewCategoryWeight(
                                e.target.value === '' ? '' : Number(e.target.value),
                            )
                        }
                        min={0}
                        max={100}
                    />
                    <span className="percent">%</span>
                </div>
                <Button
                    displayName="+ Add Category"
                    variant="primary"
                    onClick={addCategory}
                    id="add-category"
                />
            </div>

            <div className="total-row">
                <div>
                    Total weight: <strong>{totalWeight}%</strong>
                </div>
                {totalWeight !== 100 && (
                    <div className={`weight-warning ${totalWeight > 100 ? 'over' : 'under'}`}>
                        {totalWeight > 100
                            ? 'Total > 100% — please adjust weights.'
                            : 'Total ≠ 100% — recommended to sum to 100%.'}
                    </div>
                )}
            </div>

            <div className="actions">
                <Button
                    displayName="Save Categories"
                    variant="primary"
                    onClick={saveCategories}
                    id="save-choices"
                />
            </div>
        </div>
    );
};

export default CategoriesPanel;
